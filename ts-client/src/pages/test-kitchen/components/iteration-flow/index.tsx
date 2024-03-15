import "reactflow/dist/style.css";
import ReactFlow, { Controls, Background, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider, useKeyPress } from "reactflow";
import { useCallback, useRef, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

// components
import recipeNode from "../recipe-node";
import iterationNode from "../iteration-node";
import EditIteration from "../edit-iteration";
import { Drawer } from "vaul";

// services
import { useRecipe } from "@/services/hooks/recipe/useRecipe";
import { useLayout } from "../../hooks/useLayout";
import { useIteration } from "../../hooks/useIteration";

// contexts
import AuthContext from "@/services/contexts/authContext";
import SocketContext from "@/services/contexts/socketContext";

// node channels
const CONNECTION_COUNT_UPDATED_CHANNEL = import.meta.env.VITE_CONNECTION_COUNT_UPDATED_CHANNEL;
const NODE_DRAG_CHANNEL = import.meta.env.VITE_NODE_DRAG_CHANNEL;
const NODE_CREATE_CHANNEL = import.meta.env.VITE_NODE_CREATE_CHANNEL;
const NODE_DELETE_CHANNEL = import.meta.env.VITE_NODE_DELETE_CHANNEL;

// ingredient channels
const CREATE_INGREDIENT_CHANNEL = import.meta.env.VITE_CREATE_INGREDIENT_CHANNEL;
const DELETE_INGREDIENT_CHANNEL = import.meta.env.VITE_DELETE_INGREDIENT_CHANNEL;
const UPDATE_INGREDIENT_CHANNEL = import.meta.env.VITE_UPDATE_INGREDIENT_CHANNEL;

// instruction channels
const CREATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_CREATE_INSTRUCTION_CHANNEL;
const DELETE_INSTRUCTION_CHANNEL = import.meta.env.VITE_DELETE_INSTRUCTION_CHANNEL;
const UPDATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_UPDATE_INSTRUCTION_CHANNEL;

// types
import { AuthContextType, SocketContextType } from "@/services/contexts/models";
import { CountMessageType, CreateIngredientsMessageType, CreateInstructionsMessageType, DeleteIngredientMessageType, DeleteInstructionMessageType, NodeCreateMessageType, NodeDeleteMessageType, NodeDragMessageType, UpdateIngredientMessageType, UpdateInstructionChannel } from "@/types/socket";
import { IterationType } from "@/types/iteration";

const nodeTypes = {
  recipeNode: recipeNode,
  iterationNode: iterationNode,
};

const IterationFlow = () => {

  // socket
  const { socket } = useContext(SocketContext) as SocketContextType;

  // params
  const { recipeId } = useParams();

  if (!recipeId) throw new Error("id of recipe is required from parameter string")

  // auth
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id

  const [_, setConnectionCount] = useState(0);
  const connectingNodeId = useRef<string | null>(null);

  const { getRecipeById } = useRecipe();
  const { data: recipe } = getRecipeById({ recipeId });

  const { getIterationsLayout } = useLayout({ recipeId });
  const { data, isLoading } = getIterationsLayout;

  const { createIteration, deleteIteration } = useIteration()

  // set the node and edge states, defaults to empty array
  const [nodes, setNodes, onNodesChange] = useNodesState<IterationType>(data?.initialNodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data?.initialEdges || []);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connected to socket")
    });

    socket?.on(CONNECTION_COUNT_UPDATED_CHANNEL, ({ count }: CountMessageType): undefined => {
      setConnectionCount(count)
    });

    socket?.on(NODE_DRAG_CHANNEL, ({ layout, userId: emitterId, recipeId: emittedRecipeId }: NodeDragMessageType): undefined => {

      // exit if emitterId is the same as the user
      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // 
      setNodes(prev => prev.map(({ id, ...rest }) => {
        if (id === layout.id) {
          return {
            id, ...rest, position: layout.position
          };
        };
        return { id, ...rest }
      }));
    });

    socket?.on(NODE_CREATE_CHANNEL, ({ newEdge, newNode, userId: emitterId, recipeId: emittedRecipeId }: NodeCreateMessageType): undefined => {

      // exit if emitterId is the same as the user
      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // set the node and edges state
      setNodes(prev => [...prev, newNode]);
      setEdges(prev => [...prev, newEdge]);
    });

    socket?.on(NODE_DELETE_CHANNEL, ({ iterationId, userId: emitterId }: NodeDeleteMessageType): undefined => {
      // exit if emitter is the same as the user
      if (emitterId === userId) return;

      // remove the deleted node and the associated edges
      setEdges(prev => prev.filter(el => {
        return (el.source === iterationId || el.target === iterationId) ? false : true
      }));
      setNodes(prev => prev.filter(el => el.id !== iterationId));
    });

    socket?.on(CREATE_INGREDIENT_CHANNEL, (message: CreateIngredientsMessageType): undefined => {

      let { recipeId: emittedRecipeId, userId: emitterId, newIngredients, iterationId } = message;

      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // Update the global test-kitchen state
      setNodes(prev => prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { ingredients } = data;
          return { ...rest, data: { ...data, ingredients: [...ingredients, ...newIngredients] } };
        } else {
          return { ...rest, data };
        }
      }));
    });

    socket?.on(DELETE_INGREDIENT_CHANNEL, (message: DeleteIngredientMessageType): undefined => {

      let { recipeId: emittedRecipeId, userId: emitterId, ingredientId, iterationId } = message;

      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // Update the global test-kitchen state
      setNodes(prev => prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { ingredients } = data
          return { ...rest, data: { ...data, ingredients: ingredients.filter(el => el.ingredientId !== ingredientId) } };
        } else {
          return { ...rest, data };
        }
      }));
    });

    socket?.on(UPDATE_INGREDIENT_CHANNEL, (message: UpdateIngredientMessageType): undefined => {

      let { recipeId: emittedRecipeId, userId: emitterId, ingredient, iterationId, ingredientId } = message;

      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // Update the global test-kitchen state
      setNodes((prev) => (prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { ingredients } = data;
          return { ...rest, data: { ...data, ingredients: ingredients.map(el => el.ingredientId === ingredientId ? ingredient : el) } };
        } else {
          return { ...rest, data };
        }
      })));
    });

    socket?.on(CREATE_INSTRUCTION_CHANNEL, (message: CreateInstructionsMessageType): undefined => {
      let { recipeId: emittedRecipeId, userId: emitterId, newInstructions, iterationId } = message;

      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // Update the global node state
      setNodes(prev => prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { instructions } = data;
          return { ...rest, data: { ...data, instructions: [...instructions, ...newInstructions] } };
        } else {
          return { ...rest, data };
        }
      }));
    });

    socket?.on(UPDATE_INSTRUCTION_CHANNEL, (message: UpdateInstructionChannel): undefined => {
      let { recipeId: emittedRecipeId, userId: emitterId, instruction, iterationId } = message;
      let { step } = instruction;

      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // Update the global test-kitchen state
      setNodes(prev => prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { instructions } = data;
          return {
            ...rest,
            data:
            {
              ...data, instructions: instructions.map(el => el.step === step ? instruction : el)
            }
          };
        } else {
          return { ...rest, data };
        }
      }));
    });

    socket?.on(DELETE_INSTRUCTION_CHANNEL, (message: DeleteInstructionMessageType): undefined => {
      let { recipeId: emittedRecipeId, userId: emitterId, step, iterationId } = message;

      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // Update the global test-kitchen state
      setNodes(prev => prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { instructions } = data
          let newInstructions = instructions.filter(el => el.step !== step)
          return {
            ...rest, data: {
              ...data, instructions: newInstructions.map(el => el.step > step ? {
                ...el,
                step: el.step - 1
              } : el)
            }
          };
        } else {
          return { ...rest, data };
        };
      }));
    });

  }, [socket]);

  const drawerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.classList.add("fixed-body");

    return function cleanup() {
      document.body.classList.remove("fixed-body")
    }
  }, []);

  // handle the node drag or select and emit
  function nodeChangeHandler(e: any) {
    onNodesChange(e);

    e.map(({ id, type, ...rest }: any) => {
      if (type === "position") {
        let { dragging, ...other } = rest;
        if (dragging) {
          let { position } = other;
          socket?.emit(NODE_DRAG_CHANNEL, {
            layout: { id, position },
            userId: userId,
            recipeId
          });
        }
      }
    });
  }

  useEffect(() => {
    setNodes(data?.initialNodes || []);
    setEdges(data?.initialEdges || []);
  }, [data])

  // Monitor which element is clicked by the user
  const [clickedId, setClickedId] = useState(null)

  // on recipe change set clicked index as null
  useEffect(() => {
    setClickedId(null)
  }, [recipeId])

  // clicking a node sets the clicked index
  const onClickNode = useCallback((_: any, element: any) => {
    setClickedId(element.id)
  }, [])

  /*
    spacePressed is a hook checking for if user presses space bar,
    where space is pressed we want to pull up the drawer so that
    users can edit the iteration id
  */

  const spacePressed = useKeyPress('Space');

  useEffect(() => {
    if (drawerRef.current && spacePressed && clickedId && clickedId !== "root") {
      drawerRef.current.click()
      document.body.classList.add('fixed-body');
    }
  }, [spacePressed])

  // when clicking the pane the focused node is unfocused
  const onClickPane = useCallback(() => {
    setClickedId(null)
  }, [])

  const { screenToFlowPosition } = useReactFlow();

  const onConnectStart = useCallback((_: any, { nodeId }: { nodeId: string | null }) => {
    connectingNodeId.current = nodeId;
  }, []);

  // After dragging a node creates a new 
  const onConnectEnd = useCallback(
    async (event: any) => {
      if (!connectingNodeId.current) return;

      // query target pain
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {

        let input = (connectingNodeId.current === "root") ? {
          recipeId
        } : {
          parentId: connectingNodeId.current,
          recipeId,
        }

        const newIteration = await createIteration(input);

        const newNode = {
          id: newIteration.id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          type: "iterationNode",
          data: {
            id: newIteration.id,
            tag: newIteration.tag,
            ingredients: newIteration.ingredients,
            instructions: newIteration.instructions,
            parentIngredients: newIteration.parent ? newIteration.parent.ingredients : recipe?.ingredients,
            parentInstructions: newIteration.parent ? newIteration.parent.instructions : recipe?.instructions,
          },
          origin: [0.5, 0.0],
        };

        // new edge object
        const newEdge = {
          id: `${connectingNodeId.current}-${newIteration.id}`,
          source: connectingNodeId.current,
          target: newIteration.id,
        }

        // append the new node and edge to graph state
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [...eds, newEdge]);

        // emit the corresponding change
        socket?.emit(NODE_CREATE_CHANNEL, {
          newEdge,
          newNode,
          userId,
          recipeId
        });
      };
    },
    [screenToFlowPosition],
  );

  const onNodesDelete = useCallback(
    async (deleted: any) => {

      // remove focus first
      setClickedId(null);

      // delete the iterations in db
      await Promise.all(deleted.map(({ id }: { id: string }) => {
        return new Promise(resolve => resolve(
          deleteIteration({ iterationId: id })
        ))
      }));

      // for each deleted node emit a deletion
      deleted.map(({ id }: { id: string }) => {
        socket?.emit(NODE_DELETE_CHANNEL, {
          iterationId: id,
          userId,
        });
      });
    },
    [nodes, edges]
  );

  if (isLoading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="lg:h-screen h-full relative">
      <Drawer.Root direction="right">
        <ReactFlow
          nodes={nodes}
          onNodesChange={nodeChangeHandler}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onPaneClick={onClickPane}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          onNodeClick={onClickNode}
          onNodeDragStart={onClickNode}
          minZoom={0.01}
          maxZoom={10}
          // className="fixed inset-0"
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
        <Drawer.Trigger asChild ref={drawerRef}>
          <button />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-90" />
          <Drawer.Content className="flex flex-col h-full w-fit absolute top-12 lg:top-0 bottom-0 right-0 outline-none">
            {clickedId ? (
              <div className="bg-slate-50 text-slate-950 w-[32rem] shadow-lg p-2 px-5 h-full flex flex-col text-xs overflow-y-scroll">
                <EditIteration
                  iteration={nodes.find(({ id }) => id === clickedId)?.data || {} as IterationType}
                  setNodes={setNodes}
                />
              </div>
            ) : null}
          </Drawer.Content>
        </Drawer.Portal>

      </Drawer.Root>
    </div>
  )
}


export default () => (
  <ReactFlowProvider>
    <IterationFlow />
  </ReactFlowProvider>
)
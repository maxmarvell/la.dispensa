import ReactFlow, { Controls, Background, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider, getOutgoers, getConnectedEdges, getIncomers } from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useRef, useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { createIteration, deleteIteration, getIterationsLayout, } from "../../api/test-kitchen";
import { useParams } from "react-router-dom";
import recipeNode from "../../components/flow-components/recipeNode";
import iterationNode from "../../components/flow-components/iterationNode";
import { getRecipe } from "../../api/recipe";
import FocusedIteration from "../../components/test-kitchen/inspectIteration";
import AuthContext from "../../context/auth";

const CONNECTION_COUNT_UPDATED_CHANNEL = import.meta.env.VITE_CONNECTION_COUNT_UPDATED_CHANNEL;
const NODE_DRAG_CHANNEL = import.meta.env.VITE_NODE_DRAG_CHANNEL;
const NODE_CREATE_CHANNEL = import.meta.env.VITE_NODE_CREATE_CHANNEL;
const NODE_DELETE_CHANNEL = import.meta.env.VITE_NODE_DELETE_CHANNEL;

const CREATE_INGREDIENT_CHANNEL = import.meta.env.VITE_CREATE_INGREDIENT_CHANNEL;
const DELETE_INGREDIENT_CHANNEL = import.meta.env.VITE_DELETE_INGREDIENT_CHANNEL;
const UPDATE_INGREDIENT_CHANNEL = import.meta.env.VITE_UPDATE_INGREDIENT_CHANNEL;

const CREATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_CREATE_INSTRUCTION_CHANNEL;
const DELETE_INSTRUCTION_CHANNEL = import.meta.env.VITE_DELETE_INSTRUCTION_CHANNEL;
const UPDATE_INSTRUCTION_CHANNEL = import.meta.env.VITE_UPDATE_INSTRUCTION_CHANNEL;

const COMMENT_FEED_CHANNEL = import.meta.env.VITE_COMMENT_FEED_CHANNEL;

import SocketContext from "../../context/socket";


const nodeTypes = {
  recipeNode: recipeNode,
  iterationNode: iterationNode,
};

const TestKitchen = () => {

  const [connectionCount, setConnectionCount] = useState(0);
  const { socket } = useContext(SocketContext);

  const connectingNodeId = useRef(null);

  const { recipeId } = useParams();
  const { user: { id: userId } } = useContext(AuthContext);

  const { data: recipe } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const { isLoading, isError, data } = useQuery({
    queryKey: ['iterations', recipeId],
    queryFn: () => getIterationsLayout({ recipeId })
  })

  const [nodes, setNodes, onNodesChange] = useNodesState(data?.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(data?.initialEdges);

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connected to socket")
    });

    socket?.on(CONNECTION_COUNT_UPDATED_CHANNEL, ({ count }) => {
      setConnectionCount(count)
    });

    socket?.on(NODE_DRAG_CHANNEL, ({ layout, userId: emitterId, recipeId: emittedRecipeId }) => {

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

    socket?.on(NODE_CREATE_CHANNEL, ({ newEdge, newNode, userId: emitterId, recipeId: emittedRecipeId }) => {
      // exit if emitterId is the same as the user
      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // set the node and edges state
      setNodes(prev => [...prev, newNode]);
      setEdges(prev => [...prev, newEdge]);
    });

    socket?.on(NODE_DELETE_CHANNEL, ({ iterationId, userId: emitterId }) => {
      // exit if emitter is the same as the user
      if (emitterId === userId) return;

      // remove the deleted node and the associated edges
      setEdges(prev => prev.filter(el => {
        return (el.source === iterationId || el.target === iterationId) ? false : true
      }));
      setNodes(prev => prev.filter(el => el.id !== iterationId));
    });

    socket?.on(CREATE_INGREDIENT_CHANNEL, (message) => {

      let { recipeId: emittedRecipeId, userId: emitterId, newIngredients, iterationId } = message;

      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // Update the global test-kitchen state
      setNodes((prev) => (prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { ingredients } = data;
          return { ...rest, data: { ...data, ingredients: [...ingredients, ...newIngredients] } };
        } else {
          return { ...rest, data };
        }
      })));
    });

    socket?.on(DELETE_INGREDIENT_CHANNEL, (message) => {

      let { recipeId: emittedRecipeId, userId: emitterId, ingredientId, iterationId } = message;

      if (emitterId === userId) return;
      if (recipeId !== emittedRecipeId) return;

      // Update the global test-kitchen state
      setNodes((prev) => (prev.map(({ data, ...rest }) => {
        if (data.id === iterationId) {
          let { ingredients } = data
          return { ...rest, data: { ...data, ingredients: ingredients.filter(el => el.ingredientId !== ingredientId) } };
        } else {
          return { ...rest, data };
        }
      })));
    });

    socket?.on(UPDATE_INGREDIENT_CHANNEL, (message) => {

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

    socket?.on(CREATE_INSTRUCTION_CHANNEL, (message) => {
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

    socket?.on(UPDATE_INSTRUCTION_CHANNEL, (message) => {
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

    socket?.on(DELETE_INSTRUCTION_CHANNEL, (message) => {
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



  // handle the node drag or select and emit
  function nodeChangeHandler(e) {
    onNodesChange(e);

    e.map(({ id, type, ...rest }) => {
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
    setNodes(data?.initialNodes);
    setEdges(data?.initialEdges);
  }, [data])

  // Monitor which element is clicked by the user
  const [clickedId, setClickedId] = useState(null)

  // on recipe change set clicked index as null
  useEffect(() => {
    setClickedId(null)
  }, [recipeId])

  // clicking a node sets the clicked index
  const onClickNode = useCallback((_, element) => {
    setClickedId(element.id)
  }, [])

  // when clicking the pane the focused node is unfocused
  const onClickPane = useCallback(() => {
    setClickedId(null)
  }, [])

  const { screenToFlowPosition } = useReactFlow();
  const onConnect = useCallback(
    (params) => {
      connectingNodeId.current = null;
      setEdges((eds) => addEdge(params, eds))
    },
    [],
  );

  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  // After dragging a node creates a new 
  const onConnectEnd = useCallback(
    async (event) => {
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
            parentIngredients: newIteration.parent ? newIteration.parent.ingredients : recipe.ingredients,
            parentInstructions: newIteration.parent ? newIteration.parent.instructions : recipe.instructions,
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
        });
      };
    },
    [screenToFlowPosition],
  );

  const onNodesDelete = useCallback(
    async (deleted) => {

      // remove focus first
      setClickedId(null);

      // delete the iterations in db
      let result = await Promise.all(deleted.map(({ id }) => {
        return new Promise(resolve => resolve(
          deleteIteration({ iterationId: id })
        ))
      }));

      // for each deleted node emit a deletion
      deleted.map(({ id }) => {
        console.log(id, userId)
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
    <div className="flex h-full overflow-hidden">
      <ReactFlow
        nodes={nodes}
        onNodesChange={nodeChangeHandler}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onPaneClick={onClickPane}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        onNodeClick={onClickNode}
        onNodeDragStart={onClickNode}
        minZoom={0.01}
        maxZoom={10}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      {clickedId ? (
        <div className="bg-slate-50 text-slate-950 w-[32rem] shadow-lg p-2 px-5 h-full flex flex-col text-xs">
          <FocusedIteration
            iteration={nodes.find(({ id }) => id === clickedId)?.data}
            setNodes={setNodes}
          />
          <button>Number users connected: {connectionCount}</button>
        </div>
      ) : null}
    </div>
  )
}


export default () => (
  <ReactFlowProvider>
    <TestKitchen />
  </ReactFlowProvider>
)
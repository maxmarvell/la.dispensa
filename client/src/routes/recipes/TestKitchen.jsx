import ReactFlow, { Controls, Background, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider, getOutgoers, getConnectedEdges, getIncomers } from "reactflow";
import "reactflow/dist/style.css";
import { useCallback, useRef, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createIteration, getIterationsLayout, } from "../../api/test-kitchen";
import { useParams } from "react-router-dom";
import recipeNode from "../../components/flow-components/recipeNode";
import iterationNode from "../../components/flow-components/iterationNode";
import { getRecipe } from "../../api/recipe";
import FocusedIteration from "../../components/test-kitchen/inspectIteration";
import { Collapse } from "@mui/material";


const nodeTypes = {
  recipeNode: recipeNode,
  iterationNode: iterationNode,
};


const TestKitchen = () => {

  const connectingNodeId = useRef(null);

  const { recipeId } = useParams();
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
    setNodes(data?.initialNodes);
    setEdges(data?.initialEdges);
  }, [data])

  // Monitor which element is clicked by the user
  const [clickedIndex, setClickedIndex] = useState(null)

  const onClickNode = useCallback((_, element) => {
    setClickedIndex(element.data.index)
  }, [])

  const onClickPane = useCallback(() => {
    setClickedIndex(null)
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


        setNodes((nds) => [...nds, {
          ...newNode,
          data: {
            ...newNode.data,
            index: nds.length
          }
        }]);
        setEdges((eds) =>
          [...eds, { id: `${connectingNodeId.current}-${newIteration.id}`, source: connectingNodeId.current, target: newIteration.id }],
        );

        setClickedIndex(newNode.data.index);
      }
    },
    [screenToFlowPosition],
  );

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const outgoers = getOutgoers(node, nodes, edges);
          const incomers = getIncomers(node, nodes, edges)
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter((edge) => !connectedEdges.includes(edge));

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({ id: `${source}->${target}`, source, target }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
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
        onNodesChange={onNodesChange}
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
      <Collapse
        in={clickedIndex ? true : false}
        orientation="horizontal"

      >
        <div className="bg-slate-950 text-slate-50 w-92 shadow-lg p-2 pr-12 mr-12 pl-5 h-full flex flex-col text-xs divide-slate-50 divide-y">
          {clickedIndex ? (
            <FocusedIteration
              iteration={nodes[clickedIndex].data}
              setNodes={setNodes}
            />
          ) : null}
        </div>
      </Collapse>
    </div>
  )
}


export default () => (
  <ReactFlowProvider>
    <TestKitchen />
  </ReactFlowProvider>
)
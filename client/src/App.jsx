import React, { useState, useRef, useEffect } from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import "./App.css";
import StickyHeadTable from "./components/data-table";
// import Elm from "./components/node-element";
var client = new W3CWebSocket(
  "wss://salty-headland-19846.herokuapp.com/",
  "echo-protocol"
);

function App() {
  useEffect(() => {
    client.onerror = function (err) {
      console.log(err);
    };

    client.onopen = function () {
      console.log("WebSocket Client Connected");
    };

    client.onclose = function () {
      console.log("echo-protocol Client Closed");
    };

    client.onmessage = function (e) {
      console.log(JSON.parse(e.data));
      const data = JSON.parse(e.data);
      const fromAdd = data.from;
      const toAdd = data.to;
      const value = data.value;
      updateChart(fromAdd, toAdd, value);
    };
    return () => {
      client.close();
    };
  }, []);
  const styles = {
    border: "1px solid #777",
    padding: 10,
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "150px",
  };

  const [elements, setElements] = useState([
    {
      id: "0x2cdab8593656638ab89b4c8931fe50f4afb1f636",
      type: "default", // input node
      preval: "",
      node: true,
      sourcePosition: "right",
      targetPosition: "left",
      data: {
        label: <div>0x2CDab8593656638ab89B4c8931fE50f4afB1F636</div>,
      },
      position: { x: 100, y: 50 },
      style: styles,
    },
  ]);

  useEffect(() => {
    console.log("important");
    console.log(elements);
    console.log("important");
  }, [elements]);

  const [tableData, setTableData] = useState([]);
  const [tid, setTid] = useState(1);
  const [arrowid, setArrowid] = useState("a");
  const [xpos, setXpos] = useState(400);
  const [ypos, setYpos] = useState(150);
  const [addressMap, setAddressMap] = useState([
    { add: "0x2cdab8593656638ab89b4c8931fe50f4afb1f636", y_v: 50, x_v: 100 },
  ]);
  const [addlist, setAddlist] = useState([
    "0x2cdab8593656638ab89b4c8931fe50f4afb1f636",
  ]);

  function check(val, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        return true;
      }
    }
    return false;
  }

  const updateChart = (from, to, value) => {
    // update xpos, ypos if value is new, else keep pos as the default pos in index
    //loopback effect, might be too convoluted
    //or
    //make list of address and cesp y level, unique address on each y level, with id != address as that creates loopback
    var inputval = from;
    var outputval = to;
    var valueval = value;

    console.log(tableData);

    if (check(outputval, addlist)) {
      console.log("in list");
      console.log(outputval, addlist);
      setElements((els) =>
        els.concat({
          id: arrowid,
          source: inputval,
          target: outputval,
          node: false,
          animated: true,
          label: valueval,
          labelBgStyle: { fill: "#fff", color: "#ffffff", fillOpacity: 0.7 },
          arrowHeadType: "arrowclosed",
        })
      );

      setTableData((data) =>
        data.concat({
          id: tid,
          code: tid,
          from: inputval,
          to: outputval,
          amt: valueval,
        })
      );

      setTid(tid + 1);

      setArrowid(arrowid + "a");
    } else {
      setElements((els) =>
        els.concat(
          {
            id: outputval,
            preval: inputval,
            node: true,
            // you can also pass a React component as a label
            data: { label: outputval },
            sourcePosition: "right",
            targetPosition: "left",
            position: { x: xpos, y: ypos },
          },
          {
            id: arrowid,
            source: inputval,
            // node: false,
            target: outputval,
            animated: true,
            label: valueval,
            labelBgStyle: {
              fill: "#333",
              color: "#ffffff",
              fillOpacity: 0.8,
              fontWeight: 800,
            },
            arrowHeadType: "arrowclosed",
          }
        )
      );

      setTableData((data) =>
        data.concat({
          id: tid,
          code: tid,
          from: inputval,
          to: outputval,
          amt: valueval,
        })
      );

      setTid(tid + 1);

      setAddressMap(
        (els) => els.concat({ add: outputval, y_v: ypos, x_v: xpos }),
        console.log(addressMap)
      );

      setArrowid(arrowid + "a");
      setXpos(xpos + 300);
      setYpos(ypos + 100);
      setAddlist([...addlist, outputval]);
    }
  };

  const flow = [
    <ReactFlow
      elements={elements}
      elementsSelectable={false}
      nodesConnectable={false}
      nodesDraggable={true}
    >
      <Background color="#aaa" gap={15} />
      <Controls />
    </ReactFlow>,
  ];

  const table = [<StickyHeadTable els={tableData}></StickyHeadTable>];

  const [dtype, setDtype] = useState(false);

  const updateType = () => {
    dtype ? setDtype(false) : setDtype(true);
  };

  return (
    <div className="screen">
      {/* from <input ref={inputRef} />
      to <input ref={outputRef} />
      value <input ref={valueref} /> */}
      <button onClick={updateChart}>Submit</button>
      <button onClick={updateType}>change view</button>
      <div className="control-area">Display Text</div>
      <div className="flow-container">
        <div className="main-display">
          {/* <ReactFlow
            elements={elements}
            elementsSelectable={false}
            nodesConnectable={false}
            nodesDraggable={true}
          >
            <Background color="#aaa" gap={15} />
            <Controls />
          </ReactFlow> */}
          {dtype ? table : flow}
        </div>
      </div>
    </div>
  );
}

export default App;

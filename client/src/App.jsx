import React, { useState, useEffect, useRef } from "react";
import ReactFlow, { Background, Controls } from "react-flow-renderer";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import "./App.css";
import StickyHeadTable from "./components/data-table";
var client = new W3CWebSocket(
  "wss://salty-headland-19846.herokuapp.com/",
  "echo-protocol"
);

function App() {
  const [tableData, setTableData] = useState([]);
  const [tid, setTid] = useState(1);
  const [arrowid, setArrowid] = useState("a");
  const [ypos, setYpos] = useState(150);
  const baseref = useRef();
  const [addlist, setAddlist] = useState([]);
  const styles = {
    border: "2px solid #0975f7",
    padding: 0,
    borderRadius: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "150px",
    fontSize: "15px",
    backgroundColor: "#ffffff"
  };

  const [elements, setElements] = useState([]);

  const [currentFlow, setCurrentFlow] = useState({});

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

    client.onmessage = async function (e) {
      const data = JSON.parse(e.data);
      const fromAdd = data.from;
      const toAdd = data.to;
      const value = data.value;
      const txn = data.txInfo.txHash

      setArrowid((id) => id + "a");
      setYpos((ypos) => ypos + 100);
      updateChart(fromAdd, toAdd, value, txn);
    };
  });

  function check(val, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        return true;
      }
    }
    return false;
  }

  function shorten(str) {
    return str.slice(0, 5) + "..." + str.slice(-5);
  }

  function getpreXpos(arr, prepos) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === prepos) {
        return arr[i].position.x + 300;
      }
    }
  }


  const [mode, setMode] = useState(false);
  var source = mode
    ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAAAbElEQVRIiWNgGC6AEcbgLP3+loGBQYiKZr/93s0pgiLCWfr9PzE6yVHHRJLbyASjlpAEWJA5nGXfygnq+E+8OqyWMPxjEiSomfE/8erQwWgSHlmWjCZhktQNn4gfPpYgp663VI78t+Q5aTADAJRRNfRRTNkmAAAAAElFTkSuQmCC"
    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAABfElEQVRIie2UvU4CQRSFzx1AGCISpCDGVp7ERjtLOx/AyuAkkFgbfhLpLH0Ga2tjfAcoxcQG48YwC1nmWhjWYbPgoqMVJ9nm5Lt7752dPcBaK4jy5/qSCTUAG5Y/IUJn1JYXMyMpFyup9Hjr7G3b9goNryyV9n/CxW4ilWbdkRTTnEFcDw2m5rccYwpBj7ol721GLB3BiFL4JOEgKjC4ySv/NDrJuNDwyra36LiScFnlV6XST7aXJkInCDLPUunwgwYBJgS0bTApN+7kelLp3bnaJYewkrJ1f09MzREIKTA1QVwHY2pS4tZZE6l0H8AdmLyZx8RFAvZd9fi8ZQv85bfLkf6lSdrZmxh9qfwrkHn58kQF4J6zTQzRATO/wogSmJowosTgoQEd/klARqMqzYRaJpjseN3icGYWGl45CDIDAGFxUi6r/CrAA7up04Akpk1mHJOg7qiduw43iRbNyQ5Giv0N5jhD/E4pPhm15EN0EqcBGSfnAbnWr/UBDrv65ldjhLwAAAAASUVORK5CYII=";
  const updateChart = (from, to, value, txn) => {
    var inputval = from.toLowerCase();
    var outputval = to.toLowerCase();
    var valueval = value;

    if (check(outputval, addlist)) {
      setElements((els) =>
        els.concat({
          id: arrowid,
          source: inputval,
          target: outputval,
          node: false,
          animated: true,
          arrowHeadType: "arrowclosed",
        })
      );

      setCurrentFlow({ from: inputval, to: outputval, amt: valueval, hash: txn });

      setTableData((data) =>
        data.concat({
          id: tid,
          code: tid,
          from: inputval,
          to: outputval,
          amt: valueval,
          hash: txn,
        })
      );

      setTid(tid + 1);
      setArrowid((id) => id + "a");
    } else {
      setElements((els) =>
        els.concat(
          {
            id: outputval,
            preval: inputval,
            node: true,
            data: {
              label: (
                <div className="node-test">
                  {shorten(outputval)}{" "}
                  <div className="hover-display">{outputval}</div>
                </div>
              ),
            },
            sourcePosition: "right",
            targetPosition: "left",
            position: { x: getpreXpos(elements, inputval), y: ypos },
            style: styles,
          },
          {
            id: arrowid,
            source: inputval,
            node: false,
            target: outputval,
            className: "edge-name-test",
            animated: true,
            data: {
              label: (
                <div className="node-test">
                  {shorten(valueval)}{" "}
                  <div className="hover-display">{valueval}</div>
                </div>
              ),
            },
            arrowHeadType: "arrowclosed",
          }
        )
      );

      setCurrentFlow({ from: inputval, to: outputval, amt: valueval, hash: txn });

      setTableData((data) =>
        data.concat({
          id: tid,
          code: tid,
          from: inputval,
          to: outputval,
          amt: valueval,
          hash: txn,
        })
      );

      setTid(tid + 1);

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
      <Background gap={15}/>
      <Controls/>
    </ReactFlow>,
  ];

  const table = [<StickyHeadTable els={tableData}></StickyHeadTable>];

  const [dtype, setDtype] = useState(false);

  const updateType = () => {
    dtype ? setDtype(false) : setDtype(true);
    setMode(mode ? false : true);
  };

  const setBaseval = () => {
    const rootNode = baseref.current.value.toLowerCase();

    setElements([
      {
        id: rootNode,
        type: "default", 
        preval: "",
        node: true,
        sourcePosition: "right",
        targetPosition: "left",
        data: {
          label: (
            <div className="node-test">
              {shorten(rootNode)}{" "}
              <div className="hover-display">{rootNode}</div>
            </div>
          ),
        },
        position: { x: 100, y: 50 },
        style: styles,
      },
    ]);

    setTableData([])

    setAddlist([]);
    setYpos(150)
  };

  return (
    <div className="screen">


      <div className="company">pArsiq-VisuALiser</div>
      <div className="control-area">
        <div className="search-bar">
          <input type="text" className="base-input" ref={baseref}></input>
          <button className="base-fetch" onClick={setBaseval}>
            <div style={{border: "0px solid red", padding: "6px 0 0 2px"}}>
            <img alt="start" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAABmJLR0QA/wD/AP+gvaeTAAACM0lEQVRIie2XP2hTURSHv5NW8t4LtWaQTq2BdlNH7SKog6uLiOJuXVWU1EUSXKpJq6t1Fqk6CSIqLg4idXVPi4itiMmguYlN73Hrewl9eX+S4uKZ7r3nd37fudz37uMJSWNO97nj5riKFABEtGbq7ieWZSuJjcQVjs838n86zi3EXgY50GNTR1nOdsxC40G+MTRwrtg+aq19ARQipLURzZz9Vc1+HhjsFs0UllVgIk6TwCbbeswseV/6iTKRnVke9UB/qlJSOKXKaRHKIPVAfkJH5WGkb7+ke6M5i8jHwNK6Wk62Ft31oM6ZNwXZ5j0w6TvrrLnnrYZ5R+w4cy44s8hcLxSgteCuiZUrXYvaXZsIrKKHA9Pv7Ur2bZi2OZZ9DfzYqUWPpAYLHPQn8hVEQ8UlsYjsPFBdtUnBiATztq+2V9NdmxC8h/HPwKNpityiOYHlMaBk9JK5631I6pFux5YSMAUcEivlNBbpwOJ/JFQkP3ywVeNPdCzSTXV/YNxMDxbWfCNm3OvNyTCpWzRTwIxfSi01WOFdl3YksxgqtrJE4O633bXJwC11ngGbgVbO92kzeDdvtHLO89RgqvIb9Fpfze5NXKUkA5wxYCreE1VKsZHKbVPxVqJ0sV6nVtUtg14ENkJFwjdUL7Sq7p04nrHfY1PxVkzOmQ7NbznTpuo9jeuX7ALpd273xYTmBgYPMf6D44VqZ9fxXoNVeRUYv0zjEfvfqQct2ZvtMwDtivMmjcNfV1+81hW6Ne4AAAAASUVORK5CYII="></img>          </div>
          </button>
        </div>
        <div className="toggle-area">
          <button onClick={updateType} className="sw-button">
            <div style={{ paddingTop: "3px" }}>
              <img src={source} alt="" />
            </div>
          </button>
        </div>
      </div>
      <div className="flow-container">
        <div className="main-display">
          {dtype ? table : flow}
          {dtype ? (
            false
          ) : (
            <div className="current-transaction">

              <div className="current-transaction-details">
                <p><b>to : </b> {'\u00A0\u00A0\u00A0\u00A0'} {currentFlow.to}</p>
              </div>

              <div className="current-transaction-details">
                <b>from :</b> {'\u00A0\u00A0'} {currentFlow.from}
              </div>

              <div className="current-transaction-details">
                <b>value :</b> {'\u00A0'} {currentFlow.amt}
              </div>
              <div className="current-transaction-details">txnhash : {currentFlow.hash}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

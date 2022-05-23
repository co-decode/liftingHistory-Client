import { useEffect, useState, useReducer } from "react";
import Axios from "axios";
import EntriesMap from "./EntriesMap";

const reduceLoad = (loading, action) => {
  switch(action) {
    case "LOADING":
      loading = "LOADING";
      return;
    case "LOADED":
      return null;
    default:
      return null;
  }
}

function App() {
  const [get, setGet] = useState([]);
  const [recent, setRecent] = useState(false);
  const [filtered, setFiltered] = useState(false)
  const [failedReq, setFailedReq] = useState(false)

  const [loading, dispatch] = useReducer(reduceLoad, "LOADING")

  const [lowBound, setLowBound] = useState();
  const [highBound, setHighBound] = useState();

  const [date, setDate] = useState(null);
  const [alias, setAlias] = useState(null);
  const [horizontalPress, setHorizontalPress] = useState(null);
  const [verticalPress, setVerticalPress] = useState(null);
  const [verticalPull, setVerticalPull] = useState(null);
  const [elbowFlexion, setElbowFlexion] = useState(null);
  const [kneeFlexion, setKneeFlexion] = useState(null);
  const [hipHinge, setHipHinge] = useState(null);

  useEffect(() => {
    Axios.get("http://localhost:3001/sessions")
      .then((res) => {
        setGet(res.data)
        dispatch("LOADED")
      })
      .catch((err) => {console.log(err); setFailedReq(true); dispatch("LOADED")});
  }, []);

  const refreshDB = () => {
    if (recent && !filtered) {
      Axios.get("http://localhost:3001/sessions/recent")
        .then((res) => {
          setGet(res.data);
        })
        .catch((err) => console.log(err));
    } else if (!recent && !filtered) {
      Axios.get("http://localhost:3001/sessions")
        .then((res) => {
          setGet(res.data);
        })
        .catch((err) => console.log(err));
    } else if (filtered) {
        if (!recent) {
          Axios.get(`http://localhost:3001/sessions/filter/"${lowBound}"/"${highBound}"`)
          .then((res) => {
            console.log(res)
            setGet(res.data);
          })
          .catch((err) => console.log(err));
        }
        else if (recent) {
          Axios.get(`http://localhost:3001/sessions/filter/recent/"${lowBound}"/"${highBound}"`)
          .then((res) => {
            console.log(res)
            setGet(res.data);
          })
          .catch((err) => console.log(err));
        }
    }
  };

  const [message, setMessage] = useState();

  const addEntry = (e) => {
    e.preventDefault();
    Axios.post("http://localhost:3001/sessions", {
      date,
      alias,
      horizontal_press: horizontalPress,
      vertical_press: verticalPress,
      vertical_pull: verticalPull,
      elbow_flexion: elbowFlexion,
      knee_flexion: kneeFlexion,
      hip_hinge: hipHinge,
    })
      .then((res) => {
        console.log("Posting entry", res);
        setMessage(res.data);
      })
      .then(() => refreshDB())
      .catch((err) => console.log(err));
  };

  const handleToggle = () => {
    const el = document.getElementById(`addSession`);
    el.style.display !== "none"
      ? (el.style.display = "none")
      : (el.style.display = "block");
  };

  const getRecent = () => {
    if (!recent && !filtered) {
      Axios.get("http://localhost:3001/sessions/recent")
        .then((res) => {
          setGet(res.data);
        })
        .then(() => setRecent(true))
        .catch((err) => console.log(err));
    } else if (recent && !filtered) {
      Axios.get("http://localhost:3001/sessions")
        .then((res) => {
          setGet(res.data);
        })
        .then(() => setRecent(false))
        .catch((err) => console.log(err));
    } else if (filtered) {
        if (recent) {
          Axios.get(`http://localhost:3001/sessions/filter/"${lowBound}"/"${highBound}"`)
          .then((res) => {
            console.log(res)
            setGet(res.data);
          })
          .then(() => setRecent(false))
          .catch((err) => console.log(err));
        }
        else if (!recent) {
          Axios.get(`http://localhost:3001/sessions/filter/recent/"${lowBound}"/"${highBound}"`)
          .then((res) => {
            console.log(res)
            setGet(res.data);
          })
          .then(() => setRecent(true))
          .catch((err) => console.log(err));
        }
    }
  };

  const filterS = (e) => {
    if (e) e.preventDefault();
    if (!recent) {
      Axios.get(`http://localhost:3001/sessions/filter/"${lowBound}"/"${highBound}"`)
      .then((res) => {
        console.log(res)
        setGet(res.data);
        setFiltered(true);
      })
      .catch((err) => console.log(err));
    }
    else if (recent) {
      Axios.get(`http://localhost:3001/sessions/filter/recent/"${lowBound}"/"${highBound}"`)
      .then((res) => {
        console.log(res)
        setGet(res.data);
        setFiltered(true);
      })
      .catch((err) => console.log(err));
    }
  }

  const toggleFilter = (e) => {
    e.preventDefault();
    if (filtered) {
      if (!recent) {
        Axios.get(`http://localhost:3001/sessions/`)
        .then((res) => {
          console.log(res)
          setGet(res.data);
          setFiltered(false);
        })
        .catch((err) => console.log(err));
      }
      else if (recent) {
        Axios.get(`http://localhost:3001/sessions/recent/`)
        .then((res) => {
          console.log(res)
          setGet(res.data);
          setFiltered(false);
        })
        .catch((err) => console.log(err));
      }
    };
  }

  const themeChange = (e) => {
    const theme = e.target.value;
    const el = document.querySelector("html");
    switch(theme) {
      case "light":
        el.style.setProperty('--bg', 'darkgrey');
        el.style.setProperty('--b', 'white');
        el.style.setProperty('--f', 'black');
        return;
      case "dark":
        el.style.setProperty('--bg', 'darkgrey');
        el.style.setProperty('--b', 'black');
        el.style.setProperty('--f', 'grey');
        return;
      case "blue":
        el.style.setProperty('--bg', 'lightblue');
        el.style.setProperty('--b', 'lightcyan');
        el.style.setProperty('--f', 'black');
        return;
      case "green":
        el.style.setProperty('--bg', 'green');
        el.style.setProperty('--b', 'lightgreen');
        el.style.setProperty('--f', 'black');
        return;
      case "red":
        el.style.setProperty('--bg', 'darkred');
        el.style.setProperty('--b', 'lightcoral');
        el.style.setProperty('--f', 'black');
        return;
      default: 
       return;
    }
  }

  return (
    <div id="mainContainer">
      <div id="titleContainer">
        <h1>My Lifting Record</h1>
        {!loading && !failedReq 
        ? <div id="reverseContainer">
          <div id="theme">
            <label htmlFor="themer">Theme:</label>
            <select id="themer" onChange={(e)=>themeChange(e)}>
              <option value="">--Choose a Theme--</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="red">Red</option>
            </select>
          </div>
          <div id="rc2"><p>Filter:</p></div>
          <button onClick={getRecent} >{recent ? `Order by oldest session` : `Order by most recent session`}</button>
          </div>
        : null }
        {!loading && !failedReq 
        ? <form id="filterContainer">
            <label htmlFor="lowerBound">Date from:</label>
            <input id="lowerBound" type="date" onChange={(e)=>setLowBound(e.target.value)}/>
            <label htmlFor="upperBound">Date to:</label>
            <input id="upperBound" type="date" onChange={(e)=>setHighBound(e.target.value)}/>
            <button onClick={(e)=>filterS(e)}>Filter by Date</button>
            {filtered ? <button onClick={(e)=>toggleFilter(e)}>Turn off filter</button> : null}
          </form>
        : null }
      </div>
      {loading ? <div>LOADING...</div> : null}
      {failedReq ? <div>GET request failed</div> : null}
      <EntriesMap get={get} setGet={setGet} recent={recent} lowBound={lowBound} highBound={highBound} filtered={filtered} />
      <button onClick={handleToggle}>Add an Entry</button>
      <form
        id="addSession"
        style={{ display: "none" }}
        onChange={() => setMessage()}
      >
        <fieldset id="addContainer">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="text"
            onChange={(e) => setDate(e.target.value)}
          />
          <label htmlFor="alias">Alias</label>
          <input
            id="alias"
            type="text"
            onChange={(e) => setAlias(e.target.value)}
          />
          <label htmlFor="horizontalPress">Horizontal Press</label>
          <input
            id="horizontalPress"
            type="text"
            onChange={(e) => setHorizontalPress(e.target.value)}
          />
          <label htmlFor="verticalPress">Vertical Press</label>
          <input
            id="verticalPress"
            type="text"
            onChange={(e) => setVerticalPress(e.target.value)}
          />
          <label htmlFor="vertical_pull">Vertical Pull</label>
          <input
            id="vertical_pull"
            type="text"
            onChange={(e) => setVerticalPull(e.target.value)}
          />
          <label htmlFor="elbow_flexion">Elbow Flexion</label>
          <input
            id="elbow_flexion"
            type="text"
            onChange={(e) => setElbowFlexion(e.target.value)}
          />
          <label htmlFor="knee_flexion">Knee Flexion</label>
          <input
            id="knee_flexion"
            type="text"
            onChange={(e) => setKneeFlexion(e.target.value)}
          />
          <label htmlFor="hip_hinge">Hip Hinge</label>
          <input
            id="hip_hinge"
            type="text"
            onChange={(e) => setHipHinge(e.target.value)}
          />
          <div>{message}</div>
          <button onClick={(e) => addEntry(e)}>Submit Entry</button>
        </fieldset>
      </form>
    </div>
  );
}

export default App;

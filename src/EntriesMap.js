import React, { useState } from "react";
import Axios from "axios";

function EntriesMap({ get, setGet, recent, lowBound, highBound, filtered }) {
  const [date, setDate] = useState();
  const [alias, setAlias] = useState();
  const [horizontalPress, setHorizontalPress] = useState();
  const [verticalPress, setVerticalPress] = useState();
  const [verticalPull, setVerticalPull] = useState();
  const [elbowFlexion, setElbowFlexion] = useState();
  const [kneeFlexion, setKneeFlexion] = useState();
  const [hipHinge, setHipHinge] = useState();

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

  const editEntry = (e, sessionNumber) => {
    e.preventDefault();
    Axios.put(`http://localhost:3001/sessions/${sessionNumber}`, {
      date,
      alias,
      horizontal_press: horizontalPress,
      vertical_press: verticalPress,
      vertical_pull: verticalPull,
      elbow_flexion: elbowFlexion,
      knee_flexion: kneeFlexion,
      hip_hinge: hipHinge,
    })
      .then((res) => console.log("Updating data", res))
      .then(()=>refreshDB())
      .catch((err) => console.log(err));
  };

  const deleteEntry = (sessionNumber) => {
    alert("You are about to delete this entry. Are you sure?")
    Axios.delete(`http://localhost:3001/sessions/${sessionNumber}`)
    .then((res)=> console.log("Deleting Entry", res))
    .then(()=>refreshDB())
    .catch((err)=> console.log(err))
  };

  const handleToggle = (entry) => {
    const el = document.getElementById(`${entry.session_number}`);
    el.style.display !== "none" ? el.style.display = "none" : el.style.display = "grid";
    setDate(newDate(entry.date))
    setAlias(entry.alias ? entry.alias : null)
    setHorizontalPress(entry.horizontal_press ? entry.horizontal_press : null)
    setVerticalPress(entry.vertical_press ? entry.vertical_press : null)
    setVerticalPull(entry.vertical_pull ? entry.vertical_pull : null)
    setElbowFlexion(entry.elbow_flexion ? entry.elbow_flexion : null)
    setKneeFlexion(entry.knee_flexion ? entry.knee_flexion : null)
    setHipHinge(entry.hip_hinge ? entry.hip_hinge : null)
    console.log(`change`)
  }

  const newDate = (date) => {
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  } 

  return (
    <div id="mapContainer">
      {get.map((entry) => {
        return (
          <div style={{ border: "var(--bg) 1px solid" }} key={entry.session_number}>
            <div>{new Date(entry.date).toDateString()}</div>
            <div>{entry.alias}</div>
            <details>
              <summary></summary>
              {entry.horizontal_press === null ? null : (
                <div>Horizontal Press: {entry.horizontal_press}</div>
              )}
              {entry.vertical_press === null ? null : (
                <div>Vertical Press: {entry.vertical_press}</div>
              )}
              {entry.vertical_pull === null ? null : (
                <div>Vertical Pull: {entry.vertical_pull}</div>
              )}
              {entry.elbow_flexion === null ? null : (
                <div>Elbow Flexion: {entry.elbow_flexion}</div>
              )}
              {entry.knee_flexion === null ? null : (
                <div>Knee Flexion: {entry.knee_flexion}</div>
              )}
              {entry.hip_hinge === null ? null : (
                <div>Hip Hinge: {entry.hip_hinge}</div>
              )}
            </details>
            <button onClick={()=>deleteEntry(entry.session_number)}>Delete Entry</button>
            <button onClick={() => handleToggle(entry)}>Edit Entry</button>
            <form id={entry.session_number} className="updateContainer" style={{display:"none"}}>
                <label htmlFor={entry.session_number + "date"}>Date</label>
                <input id={entry.session_number + "date"} type="text" defaultValue={newDate(entry.date)} placeholder={entry.date} onChange={(e)=> setDate(e.target.value)}/>
                <label htmlFor={entry.session_number + "alias"}>Alias</label>
                <input id={entry.session_number + "alias"} type="text" defaultValue={entry.alias} placeholder={entry.alias} onChange={(e)=> setAlias(e.target.value)}/>
                <label htmlFor={entry.session_number + "horizontalPress"}>Horizontal Press</label>
                <input id={entry.session_number + "horizontalPress"} type="text" defaultValue={entry.horizontal_press} placeholder={entry.horizontal_press} onChange={(e)=> setHorizontalPress(e.target.value)} />
                <label htmlFor={entry.session_number + "verticalPress"}>Vertical Press</label>
                <input id={entry.session_number + "verticalPress"} type="text" defaultValue={entry.vertical_press} placeholder={entry.vertical_press} onChange={(e)=> setVerticalPress(e.target.value)}/>
                <label htmlFor={entry.session_number + "verticalPull"}>Vertical Pull</label>
                <input id={entry.session_number + "verticalPull"} type="text" defaultValue={entry.vertical_pull} placeholder={entry.vertical_pull} onChange={(e)=> setVerticalPull(e.target.value)}/>
                <label htmlFor={entry.session_number + "elbowFlexion"}>Elbow Flexion</label>
                <input id={entry.session_number + "elbowFlexion"} type="text" defaultValue={entry.elbow_flexion} placeholder={entry.elbow_flexion} onChange={(e)=> setElbowFlexion(e.target.value)}/>
                <label htmlFor={entry.session_number + "kneeFlexion"}>Knee Flexion</label>
                <input id={entry.session_number + "kneeFlexion"} type="text" defaultValue={entry.knee_flexion} placeholder={entry.knee_flexion} onChange={(e)=> setKneeFlexion(e.target.value)}/>
                <label htmlFor={entry.session_number + "hipHinge"}>Hip Hinge</label>
                <input id={entry.session_number + "hipHinge"} type="text" defaultValue={entry.hip_hinge} placeholder={entry.hip_hinge} onChange={(e)=> setHipHinge(e.target.value)}/>                
            <button onClick={(e) => editEntry(e, entry.session_number)}>Submit Edit</button>
            </form>
          </div>
        );
      })}
    </div>
  );
}

export default EntriesMap;

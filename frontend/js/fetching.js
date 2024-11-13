import { createToast } from "./notification.js";
import { emitToast } from "./bridge.js";

const fps30Files = ['L06_V003', 'L09_V009', 'L15_V003', 'L15_V004', 'L15_V005', 'L15_V008',
  'L15_V009', 'L15_V010', 'L15_V011', 'L15_V012', 'L15_V015', 'L15_V016', 'L15_V017', 'L15_V018',
  'L15_V019', 'L15_V022', 'L15_V023', 'L15_V024', 'L15_V025', 'L15_V028', 'L15_V029', 'L15_V030',
  'L16_V001', 'L16_V002', 'L16_V003', 'L16_V006', 'L16_V007', 'L16_V008', 'L16_V009', 'L16_V012',
  'L16_V013', 'L16_V014', 'L16_V015', 'L16_V016', 'L16_V019', 'L16_V020', 'L16_V021', 'L16_V022',
  'L16_V023', 'L16_V026', 'L16_V027', 'L16_V028', 'L16_V029', 'L17_V003', 'L17_V004', 'L17_V005',
  'L17_V006', 'L17_V007', 'L17_V010', 'L17_V011', 'L17_V012', 'L17_V013', 'L17_V014', 'L17_V017',
  'L17_V018', 'L17_V019', 'L17_V020', 'L17_V021', 'L17_V024', 'L17_V025', 'L17_V026', 'L17_V027',
  'L17_V028', 'L18_V002', 'L18_V003', 'L18_V004', 'L18_V005', 'L18_V006', 'L18_V009', 'L18_V010',
  'L18_V011', 'L18_V012', 'L18_V013', 'L18_V016', 'L18_V017', 'L18_V018', 'L18_V019', 'L18_V020',
  'L18_V023', 'L18_V024', 'L18_V025', 'L18_V026', 'L18_V027', 'L19_V001', 'L19_V003', 'L19_V004',
  'L19_V005', 'L19_V007', 'L19_V008', 'L19_V009', 'L19_V010', 'L19_V011', 'L19_V012', 'L19_V015',
  'L19_V016', 'L19_V017', 'L19_V018', 'L19_V019', 'L19_V022', 'L19_V023', 'L19_V024', 'L19_V025',
  'L19_V026', 'L19_V029', 'L19_V030', 'L19_V031', 'L20_V001', 'L20_V002', 'L20_V003', 'L20_V004',
  'L20_V007', 'L20_V008', 'L20_V009', 'L20_V010', 'L20_V011', 'L20_V014', 'L20_V015', 'L20_V016',
  'L20_V017', 'L20_V018', 'L20_V021', 'L20_V022', 'L20_V024', 'L20_V025', 'L20_V028', 'L20_V029',
  'L20_V030', 'L20_V031', 'L21_V001', 'L21_V002', 'L21_V005', 'L21_V006', 'L21_V007', 'L21_V012',
  'L21_V013', 'L21_V014', 'L21_V015', 'L21_V016', 'L21_V019', 'L21_V021', 'L21_V022', 'L21_V023',
  'L21_V026', 'L21_V027', 'L21_V028', 'L21_V029', 'L21_V030', 'L22_V001', 'L22_V004', 'L22_V005',
  'L22_V006', 'L22_V011', 'L22_V012', 'L22_V013', 'L22_V014', 'L22_V015', 'L22_V018', 'L22_V019',
  'L22_V020', 'L22_V021', 'L22_V022', 'L22_V025', 'L22_V026', 'L22_V027', 'L22_V028', 'L22_V029',
  'L24_V017', 'L24_V019', 'L24_V020', 'L24_V021', 'L24_V022', 'L24_V023', 'L24_V024', 'L24_V025',
  'L24_V027', 'L24_V028', 'L24_V029', 'L24_V030', 'L24_V031', 'L24_V033', 'L24_V035', 'L24_V036',
  'L24_V037', 'L24_V038', 'L24_V039', 'L24_V040', 'L24_V041', 'L24_V042', 'L24_V044', 'L24_V045',
  'L25_V004', 'L25_V005', 'L25_V008', 'L25_V013', 'L25_V014', 'L25_V017', 'L25_V021', 'L25_V022',
  'L25_V025', 'L25_V030', 'L25_V031', 'L25_V034', 'L25_V039', 'L25_V040', 'L25_V043', 'L25_V048',
  'L25_V049', 'L25_V052', 'L25_V057', 'L25_V058', 'L25_V061', 'L25_V066', 'L25_V067', 'L25_V070',
  'L25_V074', 'L25_V077', 'L25_V078', 'L25_V084', 'L25_V085', 'L25_V088']

export async function submit_KIS_or_QNA(name, socket, QA_answer, video_name, frame_idx, type, sessionID, evaluationID, mode) {

  let finalData = {}

  let miliSecondPoint = parseFloat(frame_idx);

  if (fps30Files.includes(video_name)) {
    miliSecondPoint = miliSecondPoint / 30.0 * 1000.0;
  }
  else miliSecondPoint = miliSecondPoint / 25.0 * 1000.0;

  let submitPath = mode == "competition" ? "https://eventretrieval.one" : "http://192.168.20.164:5000";

  if (type === "QA") {
    finalData = {
      "answerSets": [{
        "answers": [
          {
            "text": `${QA_answer}-${video_name}-${miliSecondPoint}`,
          }]
      }]
    };
    console.log("final data before submit: ", finalData);
  }
  else {
    finalData = {
      "answerSets": [{
        "answers": [
          {
            "mediaItemName": video_name,
            "start": miliSecondPoint,
            "end": miliSecondPoint,
          }]
      }]
    }
    console.log("final data before submit: ", finalData);
  }

  const sessionID_json = {
    "session": sessionID
  }

  const queryParams = new URLSearchParams(sessionID_json).toString();

  return fetch(`${submitPath}/api/v2/submit/${evaluationID}?${queryParams}`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(finalData)
  })
    .then(res => {
      console.log(res);
      if (res.ok) {
        emitToast(socket, "primary", `${name} Submitted!`);
      }
      else {
        createToast("danger", `ERROR: ${res.status} - ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      console.log(data);
      if (data.status) {
        if (data.submission === 'WRONG') {
          emitToast(socket, "danger", `Submission verdict: ${data.description}`);
        }
        else {
          emitToast(socket, "success", `Submission verdict: ${data.description}`);
        }
      }
      // Ở đây
      else {
        log_data = (data.description).split(':')[1];
        emitToast(socket, "danger", `Submission rejected: ${log_data}`);
      }
      return true;
    })
    .catch(err => {
      console.log(err);
      createToast("danger", `ERROR: ${err.message}`);
      return false;
    });
}

export async function get_evaluationID(sessionID, mode) {
  const dataInput = {
    "session": sessionID
  }

  console.log("Getting evaluation ID...");

  const queryParams = new URLSearchParams(dataInput).toString();

  let fetchPath = mode == "competition" ? "https://eventretrieval.one" : "http://192.168.20.164:5000";

  let dataID = await fetch(`${fetchPath}/api/v2/client/evaluation/list?${queryParams}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    }
  })
    .then(res => {
      if (res.ok) {
        createToast("success", "Got evaluation ID!");
        return res.json();
      }
      throw new Error(`${res.status} - ${res.statusText}`)
    })
    .then(data => {
      return data[0].id
    })
    .catch(err => {
      createToast('danger', `Cannot get evaluation ID: ${err.message}`);
    });
  return dataID;
}

export async function get_session_ID(mode) {
  const username = mode == "competition" ? "team57" : "longlb";
  const password = mode == "competition" ? "YfYw6HQgZq" : "123456";

  const login = {
    "username": username,
    "password": password
  }

  const fetchPath = mode == "competition" ? "https://eventretrieval.one" : "http://192.168.20.164:5000";

  console.log(login);

  console.log("Getting session ID...");

  let dataID = await fetch(`${fetchPath}/api/v2/login`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login)
  })
    .then(res => {
      if (res.ok) {
        createToast("success", "Got session ID!");
        return res.json();
      }
      throw new Error(`${res.status} - ${res.statusText}`);
    })
    .then(data => {
      return data.sessionId;
    })
    .catch(err => {
      createToast("danger", `Cannot get session ID: ${err.message}`);
    });
  return dataID;
}

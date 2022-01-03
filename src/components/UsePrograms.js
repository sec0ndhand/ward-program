import { useEffect, useState } from "react";
import config from "../utils/config";

export function usePrograms(selectedDate = "") {
  const [error, setError] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [program, setProgram] = useState([]);
  useEffect(() => {
    window.gapi.load("client", () => {
      window.gapi.client
        .init({
          apiKey: config.apiKey,
          // Your API key will be automatically added to the Discovery Document URLs.
          discoveryDocs: config.discoveryDocs,
        })
        .then(() => {
          // 3. Initialize and make the API request.
          window.gapi.client.load("sheets", "v4", () => {
            window.gapi.client.sheets.spreadsheets.values
              .get({
                spreadsheetId: config.spreadsheetId,
                range: "Sacrament!A1:T",
              })
              .then(
                (response) => {
                  setPrograms(transformData(response.result.values));
                  let today =
                    selectedDate === "" ? new Date() : new Date(selectedDate);
                  response.result.values.some((sundayProgram, i) => {
                    if (i === 0) return false;
                    let currentProgram = new Date(sundayProgram[0]);
                    if (today.getTime() >= currentProgram.getTime()) {
                      return false;
                    } else {
                      // setProgram(response.result.values[i - 1]);
                      setProgram(transformData([response.result.values[0], response.result.values[i - 1]])[0]);
                      return true;
                    }
                  });
                },
                (response) => {
                  setError(response.result.error);
                }
              );
          });
        });
    });
  }, []);
  return [program, programs, error];
}

export function transformData(sundays) {
  let newSundays = [...sundays];
  let header = newSundays[0];
  newSundays.shift();
  return newSundays.map((sunday, i) => {
    let sundayData = [];
    sunday.forEach((item, i) => {
      sundayData.push({data: item, name: header[i]});
    });
    return sundayData;
  });
}

export function orderProgram(program) {
  if (program.length === 0) return [];
  let order = ["Opening Hymn", "Opening Prayer", "Sacrament Hymn", "Speaker 1", "Speaker 2", "Intermediate Hymn", "Speaker 3", "Closing Hymn", "Closing Prayer"];
  return order.map(item => program.find(p => p.name === item)).filter(item => item && item.data);
}

import { useEffect, useState } from "react";
import { usePrograms, orderProgram } from "./UsePrograms";
import './Program.css';

export function Program(props) {
  const [program, programs, error] = usePrograms();
  const [order, setOrder] = useState([]);
  const [date, setDate] = useState(new Date());
  const [theme, setTheme] = useState("");
  const [link, setLink] = useState("");
  useEffect(() => {
    if (programs.length) {
      setOrder(orderProgram(program));
      setTheme(program.find(p => p.name === "Theme")?.data || "");
      setLink(program.find(p => p.name === "Link")?.data || "");
      let tmpDate = program.find(p => p.name === "Date")?.data || ""
      setDate(tmpDate ? new Date(tmpDate) : new Date());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program.length]);
  return (
    <div className="program">
      {error && <div className="error">{JSON.stringify(error)}</div>}
      <header className="program-header">
        <h1 className="title">Smithfield</h1>
        <h3 className="subtitle">
          19<sup>th</sup> Ward
        </h3>
        <h4>Sacrament Service</h4>
        {theme && <p className="italic">"{theme}"</p>}
        <p> Held on {date.toLocaleDateString()} 12:00 PM</p>
      </header>
      <hr width="100%" />
      <main className="program-items">
        {order.map((item, index) => {
          return (
            <div className="program_item" key={`program_item_${index}`}>
              <h4>{item.name}</h4>
              <p>{item.data}</p>
            </div>
          );
        })}
      </main>
      <hr width="100%" />
      <footer>
        {link && (
          <a href={link} target="_blank" rel="noreferrer">
            View Broadcast
          </a>
        )}
      </footer>
    </div>
  );
}

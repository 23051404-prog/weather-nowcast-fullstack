import { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);

  const search = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/nowcast?city=${city}`);
      setData(res.data);
    } catch (err) {
      alert("City not found or server is down.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={search} className="flex gap-4 mb-8">
          <input 
            className="flex-1 p-3 rounded bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500"
            placeholder="Search city..." 
            value={city}
            onChange={(e) => setCity(e.target.value)} 
          />
          <button type="submit" className="bg-blue-600 px-6 py-3 rounded font-bold hover:bg-blue-500">Search</button>
        </form>

        {data && (
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-3xl font-bold">{data.location.name}</h2>
                <p className="text-slate-400">{data.location.country}</p>
              </div>
              <div className="text-right">
                <p className="text-4xl">{data.current.temp}°C</p>
                <p className="text-cyan-400 text-sm mt-1">Humidity: {data.current.humidity}%</p>
                <p className="text-blue-400 text-sm">Rain: {data.current.rain}mm</p>
              </div>
            </div>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} name="Temperature" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
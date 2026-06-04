import express from 'express';
import cors from 'cors';
import path from 'path';
import db from './db';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // === API ENDPOINTS ===

  app.get('/api/regions', (req, res) => {
    try {
      const regions = db.prepare('SELECT * FROM regions').all();
      res.json(regions);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  app.get('/api/crops', (req, res) => {
    try {
      const crops = db.prepare('SELECT * FROM crops').all();
      res.json(crops);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  app.get('/api/history', (req, res) => {
    try {
      const history = db.prepare(`
        SELECT r.*, c.name as crop_name, reg.name as region_name 
        FROM risk_predictions r
        JOIN crops c ON r.crop_id = c.id
        JOIN regions reg ON r.region_id = reg.id
        ORDER BY r.prediction_date DESC
      `).all();
      res.json(history);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  app.post('/api/predict', (req, res) => {
    const { region_id, crop_id, temperature, humidity, rainfall, wind_speed } = req.body;

    try {
      // 1. Calculate risks
      let drought_risk = 'Низкий';
      let disease_risk = 'Низкий';
      let wind_risk = 'Низкий';
      let overall_risk = 'Низкий';
      let recommendation = 'Продолжать стандартный уход. Риски минимальны.';
      let type = 'Нет угрозы';

      if (temperature > 30 && rainfall < 10) {
        drought_risk = 'Высокий';
        overall_risk = 'Высокий';
        type = 'Засуха';
        recommendation = 'Увеличить частоту полива и контролировать влажность почвы.';
      } else if (humidity > 80 && rainfall > 80) {
        disease_risk = 'Высокий';
        overall_risk = 'Высокий';
        type = 'Заболевания растений';
        recommendation = 'Обработать посевы фунгицидами и обеспечить дренаж.';
      } else if (wind_speed > 15) {
        wind_risk = 'Высокий';
        overall_risk = 'Высокий';
        type = 'Повреждение посевов';
        recommendation = 'Укрепить опоры, установить ветрозащитные барьеры.';
      } else if (temperature > 28 || rainfall > 70 || wind_speed > 10 || humidity > 75) {
        overall_risk = 'Средний';
        type = 'Смешанные факторы';
        recommendation = 'Внимательно наблюдать за погодными условиями и состоянием посевов.';
      }

      // 2. Save prediction
      const insert = db.prepare(`
        INSERT INTO risk_predictions 
        (region_id, crop_id, drought_risk, disease_risk, wind_risk, overall_risk, recommendation)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const info = insert.run(region_id, crop_id, drought_risk, disease_risk, wind_risk, overall_risk, recommendation);

      // 3. Save weather data
      const insertWeather = db.prepare(`
        INSERT INTO weather_data 
        (region_id, temperature, humidity, rainfall, wind_speed)
        VALUES (?, ?, ?, ?, ?)
      `);
      insertWeather.run(region_id, temperature, humidity, rainfall, wind_speed);

      // 4. Return result
      const prediction = db.prepare('SELECT * FROM risk_predictions WHERE id = ?').get(info.lastInsertRowid);
      res.json({
        ...prediction,
        type, // add synthetic type for backward compatibility with frontend
        level: overall_risk,
        color: overall_risk === 'Высокий' ? 'red' : overall_risk === 'Средний' ? 'yellow' : 'green'
      });

    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  app.delete('/api/history', (req, res) => {
    try {
      db.prepare('DELETE FROM risk_predictions').run();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  // === FRONTEND INTEGRATION ===
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

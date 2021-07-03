import express from 'express';
export const getApp = () => {
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get('/api/v1/test', (_, res) => {
    res.json({ ok: true });
  });
  return app;
};

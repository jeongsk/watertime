import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
💧 WaterTime Server Started!

   Environment: ${process.env.NODE_ENV || 'development'}
   Port: ${PORT}
   Health Check: http://localhost:${PORT}/health
   API: http://localhost:${PORT}/api

   Ready to accept requests! 🚀
  `);
});

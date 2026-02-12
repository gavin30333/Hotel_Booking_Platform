import * as express from 'express';
import * as cors from 'cors';
import connectDB from './config/db.config';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api', routes);

// 启动服务器
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // 连接数据库
  try {
    await connectDB();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
});

export default app;
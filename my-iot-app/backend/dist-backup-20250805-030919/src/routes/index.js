import authRoutes from './auth.routes.js';
import trackingRoutes from './tracking.routes.js';
import userRoutes from './user.routes.js';
export default function routes(app) {
    app.use('/api/auth', authRoutes);
    app.use('/api/tracking', trackingRoutes);
    app.use('/api/users', userRoutes);
}
//# sourceMappingURL=index.js.map
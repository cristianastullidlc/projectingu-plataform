
export class Server {
    constructor(port) {
        this._port = port;
        this._app = express();
        this._routes = [];
        this._controllers = new Map();

        this._configureBaseMiddlewares();
    }

    get app() {
        return this._app;
    }

    get port() {
        return this._port;
    }

    _configureBaseMiddlewares() {
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));

        this._app.use(
            cors({
                origin: process.env.ALLOWED_ORIGINS
                    ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
                    : true,
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                credentials: true
            })
        );
    }

    setController(controllerClass, controller) {
        this._controllers.set(controllerClass.name, controller);
    }

    getController(controllerClass) {
        const controller = this._controllers.get(controllerClass.name);
        if (!controller) {
            throw new Error(`Controller not registered: ${controllerClass.name}`);
        }
        return controller;
    }

    addRoute(routeFactory) {
        this._routes.push(routeFactory);
    }

    configureRoutes() {
        this._routes.forEach(routeFactory => {
            this._app.use(routeFactory(this.getController.bind(this)));
        });

        this._app.use(challengeErrorMiddleware);
    }

    launch() {
        return this._app.listen(this._port, () => {
            console.log(`Server running on port ${this._port}`);
        });
    }

}
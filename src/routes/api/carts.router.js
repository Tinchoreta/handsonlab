import DataBaseCartManagerAdapter from "../../Business/adapters/DataBaseCartManagerAdapter.js";
import DataBaseProductAdapter from "../../Business/adapters/DataBaseProductAdapter.js";
import CartManagerController from "../../controllers/CartManagerController.js";
import { checkProductExistenceInCart } from "../../middlewares/business/cartMiddleware.js";
import CustomRouter from "../../middlewares/routes/CustomRouter.js";
import ROLES from "../../utils/userRoles.js";

const router = new CustomRouter();

const dataBaseProductAdapter = DataBaseProductAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const dataBaseCartAdapter = DataBaseCartManagerAdapter.getInstance(
    process.env.MONGO_DB_URI
);

const cartController = new CartManagerController(
    dataBaseCartAdapter,
    dataBaseProductAdapter
);

router.get("/", [ROLES.ADMIN], (req, res) => cartController.getCarts(req, res));
router.post("/", [ROLES.USER, ROLES.USER_PREMIUM], (req, res) => cartController.createCart(req, res));
router.get("/:cartId", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN], (req, res) => cartController.getCartById(req, res));
router.get("/:cartId/bills", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN], (req, res) => cartController.calculateCartTotalPrice(req, res));
router.get("/:cartId/purchase", [ROLES.USER, ROLES.USER_PREMIUM], (req, res) => cartController.processPurchase(req, res));
router.delete("/:cartId/product/:productId", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN], checkProductExistenceInCart, (req, res) => cartController.removeProductFromCart(req, res));
router.put("/:cartId/product/:productId/add/:units", [ROLES.USER, ROLES.USER_PREMIUM], (req, res) => cartController.addProductUnitsToCart(req, res));
router.delete("/:cartId/product/:productId/remove/:units", [ROLES.USER, ROLES.USER_PREMIUM, ROLES.ADMIN], checkProductExistenceInCart, (req, res) => cartController.removeProductUnitsFromCart(req, res));

export default router;

import { defineApp } from "convex/server";
import resend  from "@convex-dev/resend/convex.config";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rag from "@convex-dev/rag/convex.config";
import autumn from "@useautumn/convex/convex.config";


const app = defineApp();
app.use(resend);
app.use(betterAuth);
app.use(rag);
app.use(autumn);

export default app;
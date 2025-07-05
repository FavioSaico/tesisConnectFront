import { Route } from "react-router";
import { ForoPage } from "../pages/Foro";
import { ForoLayout } from "../layout/ForoLayout";

export const ForoRoutes = (
  <>
    <Route path="foro" element={<ForoLayout />}>
      <Route index element={<ForoPage />} />
    </Route>
  </>
);
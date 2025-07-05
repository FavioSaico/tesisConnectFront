import { Route } from "react-router";
import { ForoPage } from "../pages/Foro";
import { PublicacionPage } from "../pages/Publicacion";
import { ForoLayout } from "../layout/ForoLayout";

export const ForoRoutes = (
  <>
    <Route path="foro" element={<ForoLayout />}>
      <Route index element={<ForoPage />} />
      <Route path="publicacion/:id" element={<PublicacionPage />} />
    </Route>
  </>
);
import { Suspense } from "react";
import QuizEditPage from "./QuizEditPageInner";

export default function Page() {
  <Suspense fallback={<div>Loading...</div>}>
    <QuizEditPage />
  </Suspense>;
}

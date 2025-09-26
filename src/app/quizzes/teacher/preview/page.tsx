import { Suspense } from "react";
import QuizEditPage from "./QuizEditPageInner";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizEditPage />
    </Suspense>
  );
}

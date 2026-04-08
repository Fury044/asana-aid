import { createBrowserRouter } from "react-router";
import SplashScreen from "./components/SplashScreen";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import OnboardingBasicInfo from "./components/onboarding/BasicInfo";
import OnboardingBodyDetails from "./components/onboarding/BodyDetails";
import OnboardingHealthConditions from "./components/onboarding/HealthConditions";
import OnboardingMedicalHistory from "./components/onboarding/MedicalHistory";
import OnboardingGoals from "./components/onboarding/Goals";
import OnboardingExperience from "./components/onboarding/Experience";
import PlanGeneration from "./components/PlanGeneration";
import Dashboard from "./components/Dashboard";
import YogaSession from "./components/YogaSession";
import Programs from "./components/Programs";
import Progress from "./components/Progress";
import Profile from "./components/Profile";
import MainLayout from "./components/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/onboarding",
    children: [
      { path: "basic-info", Component: OnboardingBasicInfo },
      { path: "body-details", Component: OnboardingBodyDetails },
      { path: "health-conditions", Component: OnboardingHealthConditions },
      { path: "medical-history", Component: OnboardingMedicalHistory },
      { path: "goals", Component: OnboardingGoals },
      { path: "experience", Component: OnboardingExperience },
    ],
  },
  {
    path: "/plan-generation",
    Component: PlanGeneration,
  },
  {
    path: "/app",
    Component: MainLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "programs", Component: Programs },
      { path: "progress", Component: Progress },
      { path: "profile", Component: Profile },
    ],
  },
  {
    path: "/session/:programId?",
    Component: YogaSession,
  },
]);

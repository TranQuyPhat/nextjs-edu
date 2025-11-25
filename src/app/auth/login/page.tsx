"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { InputPassword } from "@/components/forms/InputPassword";
import { authService } from "@/services/authService";
import { useAuth } from "../hook/useAuth";
import Navigation from "@/components/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Mail, Lock, ArrowLeft, Shield, KeyRound, Loader2 } from "lucide-react";

// Định nghĩa schema cho từng step
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: yup
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .required("Vui lòng nhập mật khẩu"),
});

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
});

const verifyOtpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("Vui lòng nhập mã OTP")
    .matches(/^\d{6}$/, "Mã OTP phải có 6 chữ số"),
});

const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .required("Vui lòng nhập mật khẩu mới"),
  confirmPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
});

// Định nghĩa các step và schema tương ứng
const stepConfig = {
  login: {
    title: "Đăng nhập",
    description: "Nhập thông tin để truy cập hệ thống",
    schema: loginSchema,
  },
  forgot: {
    title: "Quên mật khẩu",
    description: "Nhập email để nhận mã OTP",
    schema: forgotPasswordSchema,
  },
  verifyOtp: {
    title: "Xác minh OTP",
    description: "Nhập mã OTP được gửi về email",
    schema: verifyOtpSchema,
  },
  resetPassword: {
    title: "Đặt lại mật khẩu",
    description: "Tạo mật khẩu mới cho tài khoản",
    schema: resetPasswordSchema,
  },
};

export default function LoginPage() {
  const router = useRouter();
  type StepKey = keyof typeof stepConfig;
  const [step, setStep] = useState<StepKey>("login");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  type LoginForm = { email: string; password: string };
  type ForgotForm = { email: string };
  type VerifyOtpForm = { otp: string };
  type ResetPasswordForm = { newPassword: string; confirmPassword: string };
  const currentConfig = stepConfig[step];
  const form = useForm<
    LoginForm | ForgotForm | VerifyOtpForm | ResetPasswordForm
  >({
    resolver: yupResolver(currentConfig.schema as any),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = form;
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const timer = setTimeout(() => {
        const role = localStorage.getItem("role");
        if (role) {
          router.replace(`/dashboard/${role}`);
        } else {
          router.replace("/select-role");
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    reset();
  }, [step, reset]);
  // if (loading) {
  //   return (
  //     <div>
  //       <Navigation />
  //       <div className="container mx-auto p-6 h-96 flex justify-center items-center">
  //         <DotLottieReact src="/animations/loading.lottie" loop autoplay />
  //       </div>
  //     </div>
  //   );
  // }
  if (isAuthenticated) {
    return null;
  }
  const handleLogin = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      console.log("res :", res);
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: res.userId,
          username: res.username,
          fullName: res.fullName,
          email: res.email,
          roles: res.roles,
        })
      );
      toast.success("Login successful!");
      if (res.roles && res.roles.length === 1) {
        const role = res.roles[0].toLowerCase();
        localStorage.setItem("role", role);
        console.log(role);

        router.push(`/dashboard/${role}`);
      } else {
        router.push("/select-role");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.messages?.[0] ||
        error?.response?.error ||
        "Sai tài khoản hoặc mật khẩu";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  // Xử lý gửi OTP
  const handleForgotPassword = async (data: any) => {
    setIsLoading(true);
    try {
      await authService.requestForgotOtp(data.email);
      setEmail(data.email);
      toast.success("Đã gửi mã OTP về email của bạn");
      setStep("verifyOtp");
    } catch (error: any) {
      console.log("error :", error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể gửi OTP. Vui lòng kiểm tra lại email";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý xác thực OTP
  const handleVerifyOtp = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await authService.verifyForgotOtp({
        email,
        otp: data.otp,
      });
      setResetToken(res.resetToken);
      toast.success("Xác thực OTP thành công");
      setStep("resetPassword");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.messages?.[0] ||
        error?.response?.data?.error ||
        error?.message ||
        "Mã OTP không đúng hoặc đã hết hạn";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: any) => {
    setIsLoading(true);
    try {
      await authService.resetPassword({
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      toast.success("Đặt lại mật khẩu thành công");

      // Reset tất cả state và quay về trang đăng nhập
      setEmail("");
      setResetToken("");
      setStep("login");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.messages?.[0] ?? "Đổi mật khẩu thất bại";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý submit form
  const onSubmit = async (data: any) => {
    switch (step) {
      case "login":
        await handleLogin(data);
        break;
      case "forgot":
        await handleForgotPassword(data);
        break;
      case "verifyOtp":
        await handleVerifyOtp(data);
        break;
      case "resetPassword":
        await handleResetPassword(data);
        break;
      default:
        break;
    }
  };
  const renderFormContent = () => {
    switch (step) {
      case "login": {
        const loginErrors = errors as any;
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                  {...register("email")}
                />
              </div>
              {loginErrors.email && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {loginErrors.email.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                <InputPassword
                  id="password"
                  placeholder="Nhập mật khẩu"
                  className="pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                  {...register("password")}
                />
              </div>
              {loginErrors.password && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {loginErrors.password.message as string}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setStep("forgot")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                disabled={isLoading}
              >
                Quên mật khẩu?
              </button>
            </div>
          </>
        );
      }
      case "forgot": {
        const forgotErrors = errors as any;
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email để nhận OTP"
                  className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                  {...register("email")}
                />
              </div>
              {forgotErrors.email && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {forgotErrors.email.message as string}
                </p>
              )}
            </div>
          </>
        );
      }
      case "verifyOtp": {
        const otpErrors = errors as any;
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Mã OTP
              </Label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="otp"
                  type="text"
                  placeholder="Nhập 6 chữ số OTP"
                  maxLength={6}
                  className="pl-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 text-center text-lg tracking-widest font-mono"
                  {...register("otp")}
                />
              </div>
              {otpErrors.otp && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {otpErrors.otp.message as string}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                Mã OTP đã được gửi về email: <strong className="text-blue-600 dark:text-blue-400">{email}</strong>
              </p>
            </div>
          </>
        );
      }
      case "resetPassword": {
        const resetErrors = errors as any;
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                <InputPassword
                  id="newPassword"
                  placeholder="Nhập mật khẩu mới"
                  className="pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                  {...register("newPassword")}
                />
              </div>
              {resetErrors.newPassword && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {resetErrors.newPassword.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Xác nhận mật khẩu
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10 pointer-events-none" />
                <InputPassword
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới"
                  className="pl-10 pr-10 h-11 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20"
                  {...register("confirmPassword")}
                />
              </div>
              {resetErrors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                  <span className="text-red-500">•</span>
                  {resetErrors.confirmPassword.message as string}
                </p>
              )}
            </div>
          </>
        );
      }
      default:
        return null;
    }
  };

  // Render action buttons
  const renderActionButtons = () => {
    return (
      <>
        <Button
          type="submit"
          className={`w-full h-12 text-base font-semibold shadow-lg transition-all duration-200 ${
            step === "login" 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" 
              : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý...
            </span>
          ) : (
            getSubmitButtonText()
          )}
        </Button>

        {/* Back button cho các step không phải login */}
        {step !== "login" && (
          <button
            type="button"
            onClick={handleBackButton}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors mt-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/50"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            {getBackButtonText()}
          </button>
        )}
      </>
    );
  };

  // Lấy text cho submit button
  const getSubmitButtonText = () => {
    switch (step) {
      case "login":
        return "Đăng nhập";
      case "forgot":
        return "Gửi OTP";
      case "verifyOtp":
        return "Xác nhận OTP";
      case "resetPassword":
        return "Đặt lại mật khẩu";
      default:
        return "Tiếp tục";
    }
  };

  // Lấy text cho back button
  const getBackButtonText = () => {
    switch (step) {
      case "forgot":
        return "← Quay lại đăng nhập";
      case "verifyOtp":
        return "← Thay đổi email";
      case "resetPassword":
        return "← Nhập lại OTP";
      default:
        return "← Quay lại";
    }
  };

  // Xử lý back button
  const handleBackButton = () => {
    switch (step) {
      case "forgot":
        setStep("login");
        break;
      case "verifyOtp":
        setStep("forgot");
        break;
      case "resetPassword":
        setStep("verifyOtp");
        break;
      default:
        setStep("login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              {step === "login" && <Lock className="h-6 w-6 text-white" />}
              {step === "forgot" && <Mail className="h-6 w-6 text-white" />}
              {step === "verifyOtp" && <Shield className="h-6 w-6 text-white" />}
              {step === "resetPassword" && <KeyRound className="h-6 w-6 text-white" />}
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {currentConfig.title}
          </CardTitle>
          <CardDescription className="text-center text-base text-gray-600 dark:text-gray-400">
            {currentConfig.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {renderFormContent()}
            {renderActionButtons()}
          </form>

          {/* Chỉ hiển thị phần đăng ký và Google login ở step login */}
          {step === "login" && (
            <>
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Chưa có tài khoản? </span>
                <Link
                  href="/auth/register"
                  className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                >
                  Đăng ký ngay
                </Link>
              </div>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">hoặc</span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
              </div>

              <GoogleLoginButton />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

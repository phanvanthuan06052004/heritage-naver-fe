"use client"

import { ArrowLeft, Mail, KeyRound, Eye, EyeOff, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { Button } from "~/components/common/ui/Button"
import { useForgotPasswordMutation, useResetPasswordMutation } from "~/store/apis/authSlice"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isResetComplete, setIsResetComplete] = useState(false)
  const [error, setError] = useState(null)
  const [cooldown, setCooldown] = useState(0)

  // Use the mutation hooks
  const [forgotPassword, { isLoading: isRequestingCode }] = useForgotPasswordMutation()
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()

  // Handle cooldown timer for resend button
  useEffect(() => {
    let timer
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null) // Reset error state

    try {
      // Call the forgot password API with email
      const response = await forgotPassword({ email }).unwrap()

      // Show success message
      toast.success(response.message || "Verification code has been sent to your email!")
      setIsSubmitted(true)
      setCooldown(60) // Start cooldown timer
    } catch (err) {
      // Handle error
      const errorMessage = err?.data?.message || "Unable to send recovery email. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleResendCode = async () => {
    if (cooldown > 0) return

    setError(null)
    try {
      const response = await forgotPassword({ email }).unwrap()
      toast.success(response.message || "Verification code resent!")
      setCooldown(60) // Reset cooldown timer
    } catch (err) {
      const errorMessage = err?.data?.message || "Unable to resend verification code. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    try {
      // Call the reset password API with email, code, and new password
      const response = await resetPassword({
        email,
        code: verificationCode,
        newPassword,
      }).unwrap()

      // Show success message
      toast.success(response.message || "Password reset successful!")
      setIsResetComplete(true)

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/login")
      }, 3000)
    } catch (err) {
      // Handle error
      const errorMessage = err?.data?.message || "Invalid or expired verification code. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="flex items-center justify-center sm:px-4 py-12 mt-navbar-mobile sm:mt-navbar">
      <div className="max-w-md w-full animate-fade-up">
        <div className="rounded-lg shadow-lg border border-heritage-light/50 bg-card text-card-foreground">
          <div className="flex flex-col items-center p-6 gap-1">
            <h3 className="text-xl sm:text-2xl text-heritage-dark font-bold tracking-tight">
              {isResetComplete ? "Password Reset Successful" : isSubmitted ? "Reset Password" : "Forgot Password"}
            </h3>
            <p className="text-sm text-muted-foreground text-center">
              {isResetComplete
                ? "Your password has been reset successfully"
                : isSubmitted
                  ? "Enter verification code and your new password"
                  : "Enter your email to receive verification code"}
            </p>
          </div>
          <div className="pt-0 p-6">
            {isResetComplete ? (
              <div className="space-y-4">
                <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm flex items-start">
                  <Check size={18} className="mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Password reset successful!</p>
                    <p className="mt-1">You will be redirected to the login page in a few seconds...</p>
                  </div>
                </div>
                <Button type="button" className="w-full" onClick={() => navigate("/login")}>
                  <ArrowLeft size={16} />
                  <span>Go to Login</span>
                </Button>
              </div>
            ) : !isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Enter your email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isRequestingCode}>
                  {isRequestingCode ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Mail size={16} />
                      <span>Send Verification Code</span>
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 text-blue-700 p-4 rounded-md text-sm">
                  We have sent a verification code to <strong>{email}</strong>. Please check your inbox and enter
                  the verification code below.
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="verificationCode">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="verificationCode"
                      name="verificationCode"
                      required
                      placeholder="Enter verification code..."
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="newPassword">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        required
                        placeholder="Enter new password..."
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 px-3 py-2 h-10"
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-muted-foreground" />
                        ) : (
                          <Eye size={16} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        placeholder="Confirm new password..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-10 rounded-md border px-3 py-2 placeholder:text-muted-foreground focus:ring-heritage focus:border-none focus:ring-2 focus:outline-none text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-0 px-3 py-2 h-10"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} className="text-muted-foreground" />
                        ) : (
                          <Eye size={16} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3">
                    <Button type="submit" className="w-full" disabled={isResetting}>
                      {isResetting ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          <KeyRound size={16} />
                          <span>Reset Password</span>
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      className="w-full"
                      variant="outline"
                      disabled={cooldown > 0 || isResetting}
                      onClick={handleResendCode}
                    >
                      <Mail size={16} />
                      <span>{cooldown > 0 ? `Resend code (${cooldown}s)` : "Resend verification code"}</span>
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="text-center pt-0 p-6 text-sm">
            <Link to="/login" className="text-heritage font-medium hover:underline inline-flex items-center">
              <ArrowLeft size={16} className="mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

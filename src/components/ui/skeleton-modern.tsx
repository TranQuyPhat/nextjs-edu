"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "avatar" | "text" | "button"
  animation?: "pulse" | "wave" | "shimmer"
}

export function Skeleton({ 
  className, 
  variant = "default", 
  animation = "pulse",
  ...props 
}: SkeletonProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700"
  
  const variantClasses = {
    default: "rounded-md",
    card: "rounded-xl",
    avatar: "rounded-full",
    text: "rounded-sm",
    button: "rounded-lg"
  }
  
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-wave",
    shimmer: "animate-shimmer"
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      suppressHydrationWarning
      {...props}
    />
  )
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 p-6 shadow-lg" suppressHydrationWarning>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

// Dashboard Stats Skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// Table Skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 p-6 shadow-lg" suppressHydrationWarning>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        
        {/* Table rows */}
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Activity Feed Skeleton
export function ActivitySkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 p-6 shadow-lg" suppressHydrationWarning>
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
      
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <Skeleton className="h-5 w-5 rounded-full mt-1" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 p-6 shadow-lg" suppressHydrationWarning>
      <div className="flex items-center space-x-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
      </div>
      
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )
}

// Chart Skeleton
export function ChartSkeleton() {
  const [mounted, setMounted] = useState(false);
  const [heights, setHeights] = useState<number[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate heights only on client to avoid hydration mismatch
    setHeights([...Array(7)].map(() => Math.random() * 200 + 50));
  }, []);

  // Use fixed heights for SSR to ensure consistent rendering
  const defaultHeights = [120, 180, 150, 200, 100, 160, 140];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 p-6 shadow-lg" suppressHydrationWarning>
      <div className="flex items-center justify-between mb-6" suppressHydrationWarning>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
      
      <div className="h-64 flex items-end justify-between space-x-2" suppressHydrationWarning>
        {(mounted && heights.length > 0 ? heights : defaultHeights).map((height, i) => (
          <Skeleton 
            key={i} 
            className="w-8 rounded-t-lg" 
            style={{ height: `${height}px` }}
          />
        ))}
      </div>
      
      <div className="flex justify-between mt-4" suppressHydrationWarning>
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  )
}

// Page Loading Skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 h-16 flex items-center px-4">
        <Skeleton className="h-8 w-32" />
      </div>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        
        {/* Stats */}
        <StatsSkeleton />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ActivitySkeleton />
            <TableSkeleton />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <ProfileSkeleton />
            <ChartSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}

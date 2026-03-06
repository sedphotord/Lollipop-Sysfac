"use client";
import { useEffect, useRef, useState, useCallback, useId } from "react";
import { cn } from "@/lib/utils";

// ============================================================
// MAGIC UI COMPONENTS - Animated primitives for landing page
// ============================================================

// --- AnimatedCounter: counts up to a target number ---
export function AnimatedCounter({ target, suffix = "", prefix = "", duration = 2000, className }: {
    target: number; suffix?: string; prefix?: string; duration?: number; className?: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const start = performance.now();
                const step = (now: number) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setCount(Math.floor(eased * target));
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
            }
        }, { threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [target, duration]);

    return <span ref={ref} className={cn("tabular-nums", className)}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// --- Marquee: infinite horizontal scroll ---
export function Marquee({ children, className, reverse = false, pauseOnHover = true, speed = 40 }: {
    children: React.ReactNode; className?: string; reverse?: boolean; pauseOnHover?: boolean; speed?: number;
}) {
    return (
        <div className={cn("group flex overflow-hidden [--duration:40s] [--gap:1rem] gap-[var(--gap)]", className)}
            style={{ ["--duration" as string]: `${speed}s` }}>
            {[0, 1].map(i => (
                <div key={i} className={cn(
                    "flex shrink-0 justify-around gap-[var(--gap)] min-w-full animate-marquee",
                    reverse && "[animation-direction:reverse]",
                    pauseOnHover && "group-hover:[animation-play-state:paused]"
                )}>{children}</div>
            ))}
        </div>
    );
}

// --- ShimmerButton: button with animated shimmer effect ---
export function ShimmerButton({ children, className, shimmerColor = "rgba(255,255,255,0.15)", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { shimmerColor?: string }) {
    return (
        <button className={cn(
            "relative overflow-hidden rounded-full px-8 py-3.5 font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow",
            className
        )} {...props}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-shimmer" />
            <span className="relative z-10">{children}</span>
        </button>
    );
}

// --- BorderBeam: animated beam that travels around a card border ---
export function BorderBeam({ className, size = 200, duration = 12, delay = 0, colorFrom = "#7c3aed", colorTo = "#06b6d4" }: {
    className?: string; size?: number; duration?: number; delay?: number; colorFrom?: string; colorTo?: string;
}) {
    return (
        <div className={cn("pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden", className)}>
            <div className="absolute inset-0 rounded-[inherit]"
                style={{
                    background: `conic-gradient(from calc(var(--angle) - 60deg), transparent 0%, transparent 75%, ${colorFrom} 85%, ${colorTo} 95%, transparent 100%)`,
                    animation: `border-beam-spin ${duration}s linear ${delay}s infinite`,
                    mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
                    maskComposite: "xor",
                    WebkitMaskComposite: "xor",
                    padding: "1.5px",
                }} />
        </div>
    );
}

// --- DotPattern: subtle background dots ---
export function DotPattern({ className, cr = 1, cx = 1, cy = 1, spacing = 20 }: {
    className?: string; cr?: number; cx?: number; cy?: number; spacing?: number;
}) {
    const id = useId();
    return (
        <svg className={cn("pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/30", className)}>
            <defs>
                <pattern id={id} width={spacing} height={spacing} patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                    <circle cx={cx} cy={cy} r={cr} />
                </pattern>
            </defs>
            <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
        </svg>
    );
}

// --- GradientText: animated gradient text ---
export function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={cn(
            "bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x",
            className
        )}>{children}</span>
    );
}

// --- BentoCard: for bento grid layouts ---
export function BentoCard({ children, className, glare = true }: {
    children: React.ReactNode; className?: string; glare?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [hovering, setHovering] = useState(false);

    const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }, []);

    return (
        <div ref={ref} onMouseMove={handleMove} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
            className={cn(
                "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 backdrop-blur-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-300/40",
                className
            )}>
            {glare && hovering && (
                <div className="pointer-events-none absolute inset-0 opacity-30 transition-opacity"
                    style={{ background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(124,58,237,0.15), transparent 60%)` }} />
            )}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

// --- Particles: floating particle effect ---
export function Particles({ className, count = 50, color = "#7c3aed" }: {
    className?: string; count?: number; color?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        let animId: number;
        const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
        resize();
        window.addEventListener("resize", resize);

        const particles = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width, y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            r: Math.random() * 2 + 0.5, o: Math.random() * 0.5 + 0.1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = p.o;
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
    }, [count, color]);

    return <canvas ref={canvasRef} className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}

// --- WordRotate: rotating text effect ---
export function WordRotate({ words, className, interval = 3000 }: {
    words: string[]; className?: string; interval?: number;
}) {
    const [idx, setIdx] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setIdx(p => (p + 1) % words.length), interval);
        return () => clearInterval(timer);
    }, [words.length, interval]);

    return (
        <span className="inline-block relative align-bottom overflow-hidden">
            {words.map((w, i) => (
                <span key={w} className={cn(
                    "absolute left-0 top-0 transition-all duration-500 w-full text-center",
                    className,
                    i === idx ? "translate-y-0 opacity-100" : (i === (idx - 1 + words.length) % words.length ? "-translate-y-full opacity-0" : "translate-y-full opacity-0")
                )}>{w}</span>
            ))}
            <span className={cn("invisible whitespace-nowrap", className)}>{words.reduce((a, b) => a.length > b.length ? a : b)}</span>
        </span>
    );
}

// --- TypingAnimation: typewriter effect ---
export function TypingAnimation({ text, className, speed = 50, delay = 500 }: {
    text: string; className?: string; speed?: number; delay?: number;
}) {
    const [displayed, setDisplayed] = useState("");
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    useEffect(() => {
        if (!started) return;
        if (displayed.length < text.length) {
            const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
            return () => clearTimeout(t);
        }
    }, [started, displayed, text, speed]);

    return <span className={cn(className)}>{displayed}<span className="animate-pulse">|</span></span>;
}

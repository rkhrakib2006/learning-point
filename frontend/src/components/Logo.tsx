export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return <img src="/logo.png" alt="Learning Point" className={`${className} object-contain`} />;
}
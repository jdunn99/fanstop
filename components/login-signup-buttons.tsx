import Link from "next/link";
import Button from "./ui/button";

export function LoginSignupButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost" size="sm">
          Login
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm">Sign Up</Button>
      </Link>
    </div>
  );
}

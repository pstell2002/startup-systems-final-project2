"use client"

import Link from "next/link"
import { UserButton } from "@daveyplate/better-auth-ui"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"


export function Header() {

    const router = useRouter()

    return (
        <header className="sticky top-0 z-50 px-4 py-3 border-b bg-background/60 backdrop-blur">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        CS 5356 – Final Project
                    </Link>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => router.push("/dashboard")}>
                        Dashboard
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/search")}>
                        Search Movie
                      </Button>
                    </div>
                </div>
                <UserButton />
            </div>
        </header>
    )
}



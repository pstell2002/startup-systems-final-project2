"use client"

import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { Button } from "./ui/button"

export function AdminNavEntry() {
    const { data: session, isPending } = authClient.useSession()

    if (isPending || !session?.user || session.user.role !== "admin") {
        return null
    }

    return (
        <Link href="/admin">
            <Button variant="ghost">Admin</Button>
        </Link>
    )
}
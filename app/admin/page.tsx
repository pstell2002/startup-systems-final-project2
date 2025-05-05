import { desc } from "drizzle-orm"

import { db } from "@/database/db"

import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

import { headers } from "next/headers"
import { auth } from "@/lib/auth"

import { redirect } from "next/navigation"



export default async function AdminPage() {
    
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user || session.user.role !== "admin") {
        redirect("/"); // redirect non-admins
    }


    return (
        <main className="py-8 px-4">
            <section className="container mx-auto">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

                <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-muted">
                            <tr>
                                <th className="py-2 px-4 text-left">User</th>
                                <th className="py-2 px-4 text-left">Todo</th>
                                <th className="py-2 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
} 

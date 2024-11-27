import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { User, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Head } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"


interface UsersPageProps {
    users: User[]
  }

  export default function UsersIndex({ users }: UsersPageProps) {
    return (
        <AuthenticatedLayout
        header={'User Management'}
    >
        <Head title="Users" />

      <div className="container mx-auto py-10 bg-muted/50 rounded">
        <Head title="User Management" />

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Manajemen Pegawai</h1>
          <Button className="bg-zinc-600">
            <PlusIcon className="mr-2 h-4 w-4" /> Tambah Pegawai Baru
          </Button>
        </div>

        <DataTable columns={columns} data={users} />
      </div>
      </AuthenticatedLayout>
    )
  }

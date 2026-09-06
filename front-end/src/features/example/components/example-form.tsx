"use client";
import { useActionState } from "react";
import {
  createExampleAction,
  type CreateExampleActionState,
} from "../actions/create-example.action";
const initialState: CreateExampleActionState = { success: false, message: "" };
export function ExampleForm() {
  const [state, action, pending] = useActionState(
    createExampleAction,
    initialState,
  );
  return (
    <form action={action} className="space-y-4 rounded-2xl border bg-white p-6">
      <div>
        <label htmlFor="title" className="block text-sm font-semibold">
          Judul
        </label>
        <input
          id="title"
          name="title"
          required
          minLength={3}
          maxLength={100}
          className="mt-1 w-full rounded-xl border px-3 py-2"
        />
        {state.fieldErrors?.title?.map((error) => (
          <p key={error} className="mt-1 text-sm text-red-700">
            {error}
          </p>
        ))}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-semibold">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={500}
          className="mt-1 min-h-28 w-full rounded-xl border px-3 py-2"
        />
      </div>
      <button
        disabled={pending}
        className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
      {state.message && (
        <p role="status" className="text-sm">
          {state.message}
        </p>
      )}
    </form>
  );
}

"use client";
import { useState } from "react";

export default function TestPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Page de test
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Si vous voyez cette page, l'application fonctionne correctement !
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Compteur: {count}
          </p>
          <button
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Incrémenter
          </button>
        </div>
      </div>
    </div>
  );
}

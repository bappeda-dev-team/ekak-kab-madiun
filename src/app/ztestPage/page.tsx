'use client';
import { useState } from 'react';
import { DraggableModal } from '@/components/pages/experiment/modal';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Buka Modal
      </button>

      <DraggableModal show={showModal} onClose={() => setShowModal(false)}>
        <p>Isi modal kamu di sini!</p>
      </DraggableModal>
    </div>
  );
}

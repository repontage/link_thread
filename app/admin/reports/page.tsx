import React from 'react';

export default function ReportsDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">커뮤니티 신고 관리</h1>
      <p className="mb-4">사용자 신고 내역을 관리하는 대시보드입니다.</p>
      <div className="bg-white shadow rounded p-4">
        <p className="text-gray-500">신고 내역이 없습니다.</p>
      </div>
    </div>
  );
}

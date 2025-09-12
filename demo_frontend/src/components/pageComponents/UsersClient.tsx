"use client";

export default function UsersClient() {
  return (
    <div className="users-container page-container w-full flex items-center justify-center font-sans px-6 py-6">
      <div className="users-card page-card p-8 rounded-2xl max-w-xl">
        <h1 className="users-title page-title text-3xl font-bold text-center mb-6">
          USERS
        </h1>
        <p className="users-text page-text leading-relaxed mb-4 text-justify">
          User management and administration tools will be displayed here.
        </p>
      </div>
    </div>
  );
}

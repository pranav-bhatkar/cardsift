import Container from "@cc/components/core/container";
import React from "react";

function ProfilePage() {
  return (
    <Container className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-center text-4xl font-bold">
        This is a protected page by middleware.
      </h1>
      <p className="mt-4 text-center">
        this page is under construction, please check back later.
      </p>
      <p>Sorry 💔 😢</p>
    </Container>
  );
}

export default ProfilePage;

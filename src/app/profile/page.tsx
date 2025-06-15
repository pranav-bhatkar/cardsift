import Container from "@cc/components/core/container";
import React from "react";

function ProfilePage() {
  return (
    <Container className="h-screen flex items-center flex-col justify-center">
      <h1 className="text-4xl font-bold text-center">
        This is a protected page by middleware.
      </h1>
      <p className="text-center mt-4">
        this page is under construction, please check back later.
      </p>
      <p>Sorry 💔 😢</p>
    </Container>
  );
}

export default ProfilePage;

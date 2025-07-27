
"use client";
import React from 'react';
import { TemplateBuilderPage } from '@/modules/templates/create';
import { withProtectedAuth } from "@/utils/auth";

const TemplateBuilder = () => {
  
  return (
    <TemplateBuilderPage />
  );
};

export default TemplateBuilderPage;

export const getServerSideProps = withProtectedAuth();

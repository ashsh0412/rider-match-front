import React from "react";
import { HStack, Button, Text } from "@chakra-ui/react";
import { PageNavigationProps } from "../type";

const PageNavigation: React.FC<PageNavigationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <HStack spacing={2} mt={4}>
      <Button
        size="sm"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        isDisabled={currentPage === 1}
      >
        Previous
      </Button>
      <Text>
        {currentPage} / {totalPages}
      </Text>
      <Button
        size="sm"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        isDisabled={currentPage === totalPages}
      >
        Next
      </Button>
    </HStack>
  );
};

export default PageNavigation;

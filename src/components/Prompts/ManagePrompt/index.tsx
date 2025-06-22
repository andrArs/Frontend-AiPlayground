import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ManagePrompt.css";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Prompt } from "../../shared/types/Prompt";
import { PromptCreate } from "../../shared/types/PromptCreate";
import { Scope } from "../../shared/types/Scope";
import { ScopeModel } from "../../../api/Models/ScopeModel";
import { PromptCreateModel } from "../../../api/Models/PromptCreateModel";
import { PromptsApiClient } from "../../../api/Clients/PromptsApiClients";
import { ScopesApiClient } from "../../../api/Clients/ScopeApiClients";
import { RunConfiguration } from "../RunConfiguration";

const DEFAULT_PROMPT: Prompt = {
  id: undefined,
  expected_result: undefined,
  name: undefined,
  user_message: undefined,
  system_message: undefined,
};

export const ManagePrompt: FC = () => {
  const [prompt, setPrompt] = useState<Prompt | PromptCreate>(DEFAULT_PROMPT);
  const [scopes, setScopes] = useState<Scope[]>([]);
  const [areScopesLoading, setAreScopesLoading] = useState(false);
  const [promptLoading, setPromptLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { id } = useParams();

  const navigate = useNavigate();

  const fetchPrompt = async (promptId: string) => {
    try {
      setPromptLoading(true);
      const response = await PromptsApiClient.getOneAsync(parseInt(promptId));
      if (response) {
        setPrompt(response as Prompt);
      }
      setPromptLoading(false);
    } catch (error) {
      console.error("Error fetching prompt:", error);
    }
  };

  const fetchScopes = async () => {
    try {
      setAreScopesLoading(true);

      const res = await ScopesApiClient.getAllAsync();

      const fetchedScopes = res.map((e: ScopeModel) => ({ ...e } as Scope));

      setScopes(fetchedScopes);

      setAreScopesLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const computeTitle = () => {
    if (id && prompt) {
      return (
        <>
          Manage prompt: <strong>{prompt.name}</strong>
        </>
      );
    }
    return "Create new prompt";
  };

  const handleSave = async () => {
    const valid = validateForm();
    if (!valid) {
      return;
    }
    await PromptsApiClient.createOneAsync(prompt as PromptCreateModel);
    navigate("/prompts");
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setPrompt((prevPrompt) => {
      const updatedPrompt = { ...prevPrompt, [name]: value };

      const fieldError = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: fieldError,
      }));
      return updatedPrompt;
    });
  };

  const validateField = (name: string, value: string): string => {
    const isEmpty = (val: any) =>
      val === null || val === undefined || String(val).trim() === "";

    switch (name) {
      case "name":
        return isEmpty(value) ? "Name is required" : "";
      case "scope_id":
        return isEmpty(value) ? "Scope is required" : "";
      case "system_message":
        return isEmpty(value) ? "System message is required" : "";
      case "user_message":
        return isEmpty(value) ? "User message is required" : "";
      case "expected_result":
        return isEmpty(value) ? "Expected result is required" : "";

      default:
        return "";
    }
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      "name",
      "system_message",
      "user_message",
      "expected_result",
      "scope_id",
    ];
    const newErrors: { [key: string]: string } = {};

    let isValid = true;

    for (const field of requiredFields) {
      const value = (prompt as any)[field];
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (id) {
      fetchPrompt(id);
    } else {
      fetchScopes();
    }
  }, []);

  if (areScopesLoading && promptLoading) {
    return (
      <Stack justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress size={60} />
      </Stack>
    );
  }

  return (
    <Box className="manage-prompt-wrapper">
      <Stack flexDirection="row" justifyContent="center" alignItems="center">
        <Box className={"manage-prompt-title"}>{computeTitle()}</Box>
      </Stack>
      <Stack spacing={1}>
        <Typography variant="h6">Name</Typography>
        <TextField
          key="name"
          id="name"
          name="name"
          value={prompt.name ?? ""}
          onChange={handleChange}
          disabled={!!id}
          error={!!errors.name}
          helperText={errors.name}
        />
        {!id && (
          <>
            <Typography variant="h6">Scope</Typography>
            <TextField
              select
              key="scope_id"
              id="scope_id"
              name="scope_id"
              value={(prompt as PromptCreate).scope_id ?? ""}
              onChange={handleChange}
              error={!!errors.scope_id}
              helperText={errors.scope_id}
            >
              {scopes.map((scope) => (
                <MenuItem key={scope.id} value={scope.id}>
                  {scope.name}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
        <Typography variant="h6">System message</Typography>
        <TextField
          key="system_message"
          id="system_message"
          name="system_message"
          value={prompt.system_message ?? ""}
          multiline
          rows={3}
          onChange={handleChange}
          disabled={!!id}
          error={!!errors.system_message}
          helperText={errors.system_message}
        />
        <Typography variant="h6">User message</Typography>
        <TextField
          key="user_message"
          id="user_message"
          name="user_message"
          value={prompt.user_message ?? ""}
          multiline
          rows={3}
          onChange={handleChange}
          disabled={!!id}
          error={!!errors.user_message}
          helperText={errors.user_message}
        />
        <Typography variant="h6">Expected result</Typography>
        <TextField
          key="expected_result"
          id="expected_result"
          name="expected_result"
          value={prompt.expected_result ?? ""}
          multiline
          rows={3}
          onChange={handleChange}
          disabled={!!id}
          error={!!errors.expected_result}
          helperText={errors.expected_result}
        />
      </Stack>
      {!id && (
        <Stack direction={"row"} justifyContent={"flex-end"} mt={2}>
          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={handleSave}
          >
            Save
          </Button>
        </Stack>
      )}
      {id && <RunConfiguration />}
    </Box>
  );
};
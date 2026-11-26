import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subject } from "@casl/ability";
import { Can } from "../auth/context";
import { apiRequest } from "../api/fetch";

export function RecordActions({ moduleId, type, record, actions }: {
  moduleId: string;
  type: string;
  record: { id: number };
  actions: string[];
}) {
  const client = useQueryClient();
  const [feedback, setFeedback] = useState("");
  const mutation = useMutation({
    mutationFn: (action: string) => apiRequest(`/api/${moduleId}/${record.id}/actions/${action}`, "POST"),
    onSuccess: async () => {
      setFeedback("Saved");
      await client.invalidateQueries({ queryKey: [moduleId] });
    },
  });

  return <div>
    {actions.map((action) => <Can key={action} I={action} this={subject(type, record)}>
      <button disabled={mutation.isPending} onClick={() => {
        setFeedback("");
        mutation.mutate(action);
      }}>{action[0].toUpperCase() + action.slice(1)}</button>
    </Can>)}
    {mutation.error && <span role="alert">{mutation.error.message}</span>}
    {feedback && <span role="status">{feedback}</span>}
  </div>;
}

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import * as z from "zod";
import { ProblemSchema, ContestSchema } from "@/schemas";
import { FormError } from "../../form-error";
import { FormSuccess } from "../../form-success";
import { useSession } from "next-auth/react";
import { UserRole, Difficulty } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface TestCase {
  id: string;
  input: string;
  output: string;
  isSampleTestCase: boolean;
}

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  topics: string;
  userId: string;
}

interface ProblemEditProps {
  problemId?: string;
  contestId?: string;
}

const ProblemEdit: React.FC<ProblemEditProps> = ({ problemId, contestId }) => {
  const { data: session, status } = useSession({ required: true });
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof ProblemSchema> & z.infer<typeof ContestSchema>>();
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    const fetchProblem = async () => {
      setIsLoading(true);
      try {
        let response;
        if (problemId) {
          response = await fetch(`/api/problems/${problemId}`, {
            cache: "no-store",
          });
        } else if (contestId) {
          response = await fetch(`/api/contests/${contestId}`, {
            cache: "no-store",
          });
        } else {
          throw new Error("Either problemId or contestId must be provided");
        }

        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        if (problemId) {
          setValue("title", data.title);
          setValue("description", data.description);
          setValue("difficulty", data.difficulty);
          setValue("topics", data.topics);
          setTestCases(data.testCases || []);
        } else if (contestId) {
          setValue("name", data.name);
          setValue("startTime", data.startTime);
          setValue("endTime", data.endTime);
          setSelectedProblems(
            data.problems.map((problem: Problem) => problem.id)
          );
          setProblems(data.problems || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (problemId || contestId) {
      fetchProblem();
    }
  }, [problemId, contestId, setValue]);

  const updateProblem = async (
    problemId: string,
    data: z.infer<typeof ProblemSchema> & { testCases: TestCase[] },
    userId: string,
    userRole: UserRole
  ) => {
    try {
      const response = await fetch(`/api/problems/${problemId}`, {
        cache: "no-store",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, userId, userRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update problem");
      }

      const result = await response.json();
      return { success: "Problem updated successfully", error: undefined };
    } catch (error) {
      console.error("Error updating problem:", error);
      return {
        error: "Failed to update problem. Please try again.",
        success: undefined,
      };
    }
  };

  const updateContest = async (
    contestId: string,
    data: z.infer<typeof ContestSchema> & { problemIds: string[] },
    userId: string,
    userRole: UserRole
  ) => {
    try {
      const response = await fetch(`/api/contests/${contestId}`, {
        cache: "no-store",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, userId, userRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update contest");
      }

      const result = await response.json();
      return { success: "Contest updated successfully", error: undefined };
    } catch (error) {
      console.error("Error updating contest:", error);
      return {
        error: "Failed to update contest. Please try again.",
        success: undefined,
      };
    }
  };

  const onSubmit = async (
    values: z.infer<typeof ProblemSchema> & z.infer<typeof ContestSchema>
  ) => {
    setError("");
    setSuccess("");

    if (status === "loading" || !session?.user) {
      setError("You must be logged in to edit a problem or contest");
      return;
    }
    const { id: userId, role: userRole } = session.user;

    if (!userId || !userRole) {
      setError("User information is missing");
      return;
    }

    startTransition(() => {
      if (problemId) {
        const data = {
          ...values,
          testCases: testCases.map((testCase) => ({
            id: testCase.id,
            input: testCase.input,
            output: testCase.output,
            isSampleTestCase: testCase.isSampleTestCase,
          })),
        };
        updateProblem(problemId, data, userId, userRole as UserRole).then(
          (data) => {
            setError(data.error);
            setSuccess(data.success);
          }
        );
      } else if (contestId) {
        const data = {
          ...values,
          problemIds: selectedProblems,
        };
        updateContest(contestId, data, userId, userRole as UserRole).then(
          (data) => {
            setError(data.error);
            setSuccess(data.success);
          }
        );
      } else {
        setError("Problem or Contest ID is missing");
      }
    });
  };

  const handleProblemSelect = (problemId: string) => {
    setSelectedProblems((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId]
    );
  };

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    const newTestCases = [...testCases];
    newTestCases[index] = {
      ...newTestCases[index],
      [name.split(".")[1]]: value,
    };
    setTestCases(newTestCases);
  };

  const handleCheckboxChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    const newTestCases = [...testCases];
    newTestCases[index].isSampleTestCase = checked;
    setTestCases(newTestCases);
  };

  const handleAddTestCase = () => {
    setTestCases([
      ...testCases,
      { id: "", input: "", output: "", isSampleTestCase: false },
    ]);
  };

  const handleRemoveTestCase = (index: number) => {
    const newTestCases = [...testCases];
    newTestCases.splice(index, 1);
    setTestCases(newTestCases);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="w-full max-w-4xl shadow-md h-[80vh] overflow-auto scrollbar-hide">
      <CardHeader>
        <h2 className="text-2xl font-bold">
          {problemId ? "Edit Problem" : "Edit Contest"}
        </h2>
      </CardHeader>
      <CardContent className="overflow-y-auto no-scrollbar h-full">
        <ScrollArea className="h-full w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {problemId && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      disabled={isPending}
                      type="text"
                      {...register("title", { required: true })}
                      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm ${
                        errors.title ? "border-red-500" : ""
                      }`}
                    />
                    {errors.title && (
                      <span className="text-sm text-red-500">
                        Title is required
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Difficulty
                    </label>
                    <select
                      disabled={isPending}
                      {...register("difficulty", { required: true })}
                      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm ${
                        errors.difficulty ? "border-red-500" : ""
                      }`}
                    >
                      {Object.values(Difficulty).map((diff) => (
                        <option key={diff} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </select>
                    {errors.difficulty && (
                      <span className="text-sm text-red-500">
                        Difficulty is required
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Topic
                    </label>
                    <input
                      disabled={isPending}
                      type="text"
                      {...register("topics", { required: true })}
                      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm ${
                        errors.topics ? "border-red-500" : ""
                      }`}
                    />
                    {errors.topics && (
                      <span className="text-sm text-red-500">
                        Topic is required
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      disabled={isPending}
                      {...register("description")}
                      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm ${
                        errors.description ? "border-red-500" : ""
                      }`}
                    />
                    {errors.description && (
                      <span className="text-sm text-red-500">
                        Description is required
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Test Cases
                  </label>
                  {testCases.length > 0 ? (
                    testCases.map((testCase, index) => (
                      <div key={index} className="space-y-2 mb-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Input
                            </label>
                            <input
                              disabled={isPending}
                              type="text"
                              name={`testCases[${index}].input`}
                              value={testCase.input}
                              onChange={(event) =>
                                handleInputChange(index, event)
                              }
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Output
                            </label>
                            <input
                              disabled={isPending}
                              type="text"
                              name={`testCases[${index}].output`}
                              value={testCase.output}
                              onChange={(event) =>
                                handleInputChange(index, event)
                              }
                              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                              Is Sample Test Case
                            </label>
                            <input
                              disabled={isPending}
                              type="checkbox"
                              name={`testCases[${index}].isSampleTestCase`}
                              checked={testCase.isSampleTestCase}
                              onChange={(event) =>
                                handleCheckboxChange(index, event)
                              }
                              className="form-checkbox h-4 w-4 text-black transition duration-150 ease-in-out"
                            />
                          </div>
                          <button
                            disabled={isPending}
                            type="button"
                            onClick={() => handleRemoveTestCase(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove Test Case
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No test cases available.</p>
                  )}
                  <button
                    type="button"
                    onClick={handleAddTestCase}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Add Test Case
                  </button>
                </div>
              </>
            )}
            {contestId && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Contest Name
                  </label>
                  <input
                    disabled={isPending}
                    type="text"
                    {...register("name", { required: true })}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <span className="text-sm text-red-500">
                      Contest name is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Start Date and Time
                  </label>
                  <input
                    disabled={isPending}
                    type="datetime-local"
                    {...register("startTime", { required: true })}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.startTime ? "border-red-500" : ""
                    }`}
                  />
                  {errors.startTime && (
                    <span className="text-sm text-red-500">
                      Start time is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    End Date and Time
                  </label>
                  <input
                    disabled={isPending}
                    type="datetime-local"
                    {...register("endTime", { required: true })}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                      errors.endTime ? "border-red-500" : ""
                    }`}
                  />
                  {errors.endTime && (
                    <span className="text-sm text-red-500">
                      End time is required
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select Problems
                  </label>
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {filteredProblems.map((problem) => (
                    <div key={problem.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={problem.id}
                        checked={selectedProblems.includes(problem.id)}
                        onChange={() => handleProblemSelect(problem.id)}
                        className="mr-2"
                      />
                      <label htmlFor={problem.id}>{problem.title}</label>
                    </div>
                  ))}
                </div>
              </>
            )}
            <FormError message={error} />
            <FormSuccess message={success} />
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              {problemId ? "Update Problem" : "Update Contest"}
            </button>
          </form>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProblemEdit;

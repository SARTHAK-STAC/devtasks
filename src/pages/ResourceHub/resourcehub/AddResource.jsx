import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import ThemeToggle from "../../../components/ThemeToggle";
import { toast } from "sonner";

const categories = ["GENERAL", "LOCALHOST", "STAGING", "FIGMA", "DOCUMENTATION"];

const AddResource = () => {
  const navigate = useNavigate();
  const { dark } = useTheme();
  const [resource, setResource] = useState({
    id: null,
    title: "",
    url: "",
    description: "",
    category: "GENERAL",
    createdAt: null
  });
  const [resources, setResources] = useState(() => {
    const existingResources = localStorage.getItem("dev_resources");
    return existingResources ? JSON.parse(existingResources) : [];
  });
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    localStorage.setItem("dev_resources", JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    if (isEdit) {
      if (resources.length === 0) {
        toast.error("Resource not found.");
        navigate("/resourcehub/add");
        return;
      }
      const getResourceById = (id) => {
        const existingResource = resources.find((item) => item.id === id);
        if (!existingResource) {
          toast.error("Resource not found.");
          navigate("/resourcehub/add");
          return;
        }
        setResource(existingResource);
      };

      getResourceById(id);
      document.title = "Edit Resource | DevTasks"
    } 
  }, [id, isEdit, resources, navigate]);

  const addResource = (newResource) => {
    setResources([
      ...resources,
      {
        id: crypto.randomUUID(),
        ...newResource,
        createdAt: new Date().toISOString(),
      }
    ]);
  };

  const updateResource = (resource) => {
    setResources(resources.map((existingResource) => (
      existingResource.id === resource.id ? {...resource} : existingResource
    )));
  };


  const handleSubmit = (event) => {
    event.preventDefault()
    const validationErrors = [];
    const trimedResourceTitle = resource.title.trim();
    const trimedResourceUrl = resource.url.trim();

    if (!trimedResourceTitle) {
      validationErrors.push("・Resource name");
    }
    if (!trimedResourceUrl) {
      validationErrors.push("・Resource url");
    }
    if (!resource.category) {
      validationErrors.push("・Category tag");
    }

    if (validationErrors.length > 0) {
      toast.error("The following items are either not filled in or not selected.",
        { 
          description: (
            <div>
              {validationErrors.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div>
          )
        }
      );
      return;
    }

    const resourceValue = {
      title: trimedResourceTitle,
      url: trimedResourceUrl,
      category: resource.category,
      description: resource.description
    };

    if (isEdit) {
      updateResource({
        id: resource.id,
        ...resourceValue,
        createdAt: resource.createdAt
      });
    } else {
      addResource(resourceValue);
    }

    toast.success(isEdit ? "Resource successfully updated." : "Resource successfully added.",
      {
        action: {
          label: "view list",
          onClick: () => navigate("/resourcehub/list")
        }
      }
    );

    setResource({
      id: null,
      title: "",
      url: "",
      description: "",
      category: "GENERAL",
      createdAt: null
    });
  };

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 py-8 flex items-center justify-center transition-colors duration-300 overflow-hidden relative ${
        dark ? "bg-zinc-950" : "bg-[#F7F7F7]"
      }`}
    >
      <title>Add Resource | DevTasks</title>
      <meta name="description" content="Create and manage development resources." />

      <div
        className={`absolute top-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] opacity-30 transition-colors duration-500 ${
          dark ? "bg-zinc-800" : "bg-neutral-200"
        }`}
      />
      <div
        className={`absolute bottom-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] opacity-30 transition-colors duration-500 ${
          dark ? "bg-zinc-900" : "bg-neutral-100"
        }`}
      />

      <div
        className={`relative z-10 w-[85%] max-w-none rounded-[32px] border shadow-2xl overflow-hidden transition-all duration-300 ${
          dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-neutral-200"
        }`}
      >
        <div
          className={`h-2 w-full transition-colors duration-500 ${
            dark ? "bg-white" : "bg-black"
          }`}
        />

        <div className="flex items-start justify-between px-6 sm:px-10 pt-8 sm:pt-10 gap-4">
          <div>
            <h1
              className={`text-2xl sm:text-3xl font-black uppercase tracking-tight transition-colors duration-300 ${
                dark ? "text-white" : "text-black"
              }`}
            >
              {isEdit ? "Edit Resource" : "Add New Resource"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Save project links, docs, designs, and staging references
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col justify-between lg:col-span-7">
            <div className="space-y-5">
              <div className="group flex flex-col space-y-2">
                <label
                  className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    dark
                      ? "text-zinc-400 group-focus-within:text-white"
                      : "text-neutral-500 group-focus-within:text-black"
                  }`}
                >
                  Resource Name
                </label>
                <input
                  type="text"
                  value={resource.title}
                  onChange={(e) => setResource({...resource, title: e.target.value})}
                  placeholder="e.g. Product Design System"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold outline-none transition-all duration-300 ${
                    dark
                      ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white"
                      : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                />
              </div>

              <div className="group flex flex-col space-y-2">
                <label
                  className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    dark
                      ? "text-zinc-400 group-focus-within:text-white"
                      : "text-neutral-500 group-focus-within:text-black"
                  }`}
                >
                  Resource URL
                </label>
                <input
                  type="url"
                  value={resource.url}
                  onChange={(e) => setResource({...resource, url: e.target.value})}
                  placeholder="https://example.com/resource"
                  className={`w-full px-4 py-3 rounded-2xl border text-sm font-semibold outline-none transition-all duration-300 ${
                    dark
                      ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white"
                      : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                />
              </div>

              <div className="group flex flex-col space-y-2">
                <label
                  className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    dark
                      ? "text-zinc-400 group-focus-within:text-white"
                      : "text-neutral-500 group-focus-within:text-black"
                  }`}
                >
                  Category Tags
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setResource({...resource, category: item})}
                      className={`px-2 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest border transition-all duration-300 ${
                        resource.category === item
                          ? dark
                            ? "bg-white text-black border-white"
                            : "bg-black text-white border-black"
                          : dark
                            ? "bg-zinc-800 border-zinc-700 text-neutral-300 hover:border-white hover:text-white"
                            : "bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="group flex flex-col space-y-2">
                <label
                  className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                    dark
                      ? "text-zinc-400 group-focus-within:text-white"
                      : "text-neutral-500 group-focus-within:text-black"
                  }`}
                >
                  Description
                </label>
                <textarea
                  value={resource.description}
                  onChange={(e) => setResource({...resource, description: e.target.value})}
                  placeholder="Add a short note about when to use this resource."
                  rows={5}
                  className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all duration-300 resize-none ${
                    dark
                      ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white"
                      : "bg-neutral-50 border-neutral-300 text-black placeholder-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                  }`}
                />
              </div>
            </div>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/resourcehub"
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all duration-300 transform active:scale-95 text-center ${
                  dark
                    ? "bg-zinc-900 border-zinc-700 text-neutral-300 hover:border-white hover:text-white"
                    : "bg-white border-neutral-300 text-neutral-600 hover:border-black hover:text-black"
                }`}
              >
                Cancel
              </Link>
              <button
                type="submit"
                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all duration-300 transform active:scale-95 ${
                  dark
                    ? "bg-white border-white text-black hover:bg-neutral-200"
                    : "bg-black border-black text-white hover:bg-neutral-800"
                }`}
              >
                {isEdit ? "Update Resource" : "Submit Resource"}
              </button>
            </div>
          </form>

          <div className="flex flex-col justify-start lg:col-span-5">
            <div className="flex flex-col h-full">
              <span
                className={`text-xs font-black uppercase tracking-widest mb-2 transition-colors ${
                  dark ? "text-zinc-500" : "text-neutral-400"
                }`}
              >
                Live Board Preview
              </span>

              {/* Resource Card Mock */}
              <div
                className={`p-6 rounded-[24px] border flex flex-col justify-between min-h-[280px] h-full transition-all duration-500 relative overflow-hidden group ${
                  dark ? "bg-zinc-950/40 border-zinc-800" : "bg-neutral-50 border-neutral-250"
                }`}
              >
                {/* Visual grid background pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#808080_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${dark ? "bg-white text-black" : "bg-black text-white"}
                        `}
                    >
                      <span>{resource.category}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-zinc-700" />
                    </div>
                  </div>

                  {/* Title Preview */}
                  <h3
                    className={`text-lg font-black uppercase tracking-tight transition-colors duration-300 break-words ${
                      resource.title.trim()
                        ? dark
                          ? "text-white"
                          : "text-black"
                        : "text-neutral-400 italic"
                    }`}
                  >
                    {resource.title.trim() ? resource.title : "Unnamed Resource"}
                  </h3>

                  {/* Resource url preview */}
                  <div className={`flex flex-col gap-2`}>
                    <label
                      className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                        dark
                          ? "text-zinc-400 group-focus-within:text-white"
                          : "text-neutral-500 group-focus-within:text-black"
                      }`}
                    >
                      Url
                    </label>
                    <div
                      className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto max-h-[70px] transition-all duration-300 select-all ${
                        dark
                          ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                          : "bg-white border-neutral-200 text-neutral-600"
                      }`}
                    >
                      {resource.url.trim() ? (
                        <pre className="whitespace-pre-wrap break-all font-semibold">{resource.url}</pre>
                    ) : (
                      <span className="text-neutral-400 italic font-sans">
                        // resource url preview will appear here...
                      </span>
                      )}
                    </div>
                  </div>

                  {/* Description preview */}
                  <div className={`flex flex-col gap-2`}>
                    <label
                      className={`text-xs font-black uppercase tracking-widest transition-colors duration-300 ${
                        dark
                          ? "text-zinc-400 group-focus-within:text-white"
                          : "text-neutral-500 group-focus-within:text-black"
                      }`}
                    >
                      Description
                    </label>
                    <div
                      className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto max-h-[140px] transition-all duration-300 select-all ${
                        dark
                          ? "bg-zinc-900 border-zinc-800 text-zinc-300"
                          : "bg-white border-neutral-200 text-neutral-600"
                      }`}
                    >
                      {resource.description.trim() ? (
                        <pre className="whitespace-pre-wrap break-all font-semibold">{resource.description}</pre>
                    ) : (
                      <span className="text-neutral-400 italic font-sans">
                        // description preview will appear here...
                      </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer indicators */}
                <div className="relative z-10 pt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400 border-t border-neutral-100 dark:border-zinc-800 mt-4">
                  <span>Resource Preview</span>
                  <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100 cursor-not-allowed">
                    <span>Copy</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="px-6 sm:px-10 pb-8 flex items-center border-t border-neutral-100 dark:border-zinc-800 pt-6">
          <Link
            to="/resourcehub"
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              dark
                ? "text-neutral-400 hover:text-white"
                : "text-neutral-500 hover:text-black"
            }`}
          >
            <span>&larr;</span>
            <span>Back to Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddResource;

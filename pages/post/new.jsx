import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

export default function NewPost() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (topic === "" || keywords === "") return;

      setLoading(true);

      const response = await fetch(`/api/generate-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keywords }),
      });

      const json = await response.json();

      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      } else {
        alert("Something went wrong, please try again later");
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {loading && (
        <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6 className="font-body">Generating...</h6>
        </div>
      )}

      {!loading && (
        <div className="w-full h-full flex flex-col overflow-auto">
          <form
            onSubmit={handleSubmit}
            className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
          >
            <div>
              <label htmlFor="topic">
                <strong>Generate a blog post on the topic of: </strong>
              </label>
              <textarea
                name="topic"
                id="topic"
                required
                minLength={3}
                maxLength={80}
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="keywords">
                <strong>Targeting the following keywords: </strong>
              </label>
              <textarea
                name="keywords"
                id="keywords"
                required
                minLength={5}
                maxLength={80}
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <small className="block mb-2 ">
                Separate keywords with a comma
              </small>
            </div>
            <button type="submit" className="btn">
              Generate
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false,
        },
      };
    }
    return {
      props,
    };
  },
});

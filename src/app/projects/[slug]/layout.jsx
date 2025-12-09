

export async function generateMetadata({ params }) {
  const tempSlug = await params
  const slug = tempSlug.slug

  return {
    title: `${slug} | Project Details`,
    description: `Details about project: ${slug}`,
  };
}

export default function ProjectLayout({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

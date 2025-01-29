import BillSplitter from "@/components/BillSplitter";

export default function Home() {
  return (
    <main className=" bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-2xl mx-auto">
          <h1 className="px-4 py-6 text-2xl font-bold">Bill Splitter</h1>
        </div>
      </div>
      <div className="px-4 py-6 mx-auto max-w-2xl">
        <BillSplitter />
      </div>
    </main>
  );
}

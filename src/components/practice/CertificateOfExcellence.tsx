






"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Download, Share2 } from "lucide-react";

type CertificateOfExcellenceProps = {
  subject: string;
  exam: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  studentName?: string;
};

export default function CertificateOfExcellence({
  subject,
  exam,
  score,
  totalQuestions,
  percentage,
  studentName = "",
}: CertificateOfExcellenceProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState(studentName);
  const [certificateId, setCertificateId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
    setCertificateId(
      `LFY-${Date.now().toString(36).toUpperCase()}-${randomPart}`,
    );
  }, []);

  const issuedDate = new Date().toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function downloadCertificate() {
    const certificate = certificateRef.current;

    if (!certificate) return;

    const printable = certificate.innerHTML;
    const printWindow = window.open("", "_blank", "width=1000,height=750");

    if (!printWindow) {
      setMessage("Allow pop-ups to print or save your certificate.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Learnyfi Certificate of Excellence</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            @page { size: landscape; margin: 10mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 20px;
              font-family: Georgia, "Times New Roman", serif;
              color: #172554;
              background: white;
            }
            .certificate {
              width: 100%;
              max-width: 1100px;
              margin: auto;
              padding: 35px;
              text-align: center;
              border: 8px double #c59b35;
              outline: 2px solid #172554;
              outline-offset: -17px;
              background: #fffdf5;
            }
            .certificate h1 {
              font-size: 42px;
              margin: 12px 0;
              color: #172554;
            }
            .certificate h2 {
              font-size: 25px;
              color: #9a7624;
              margin: 12px 0;
            }
            .certificate p { line-height: 1.6; }
            .student-name {
              font-size: 34px;
              font-weight: bold;
              border-bottom: 2px solid #c59b35;
              display: inline-block;
              padding: 8px 30px;
              margin: 12px 0;
            }
            .score { font-size: 24px; font-weight: bold; }
            .certificate-footer {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              margin-top: 28px;
              font-size: 12px;
            }
            @media print {
              body { padding: 0; }
              .certificate { max-width: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate">${printable}</div>
          <script>
            window.onload = () => {
              window.print();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    setMessage("Choose Save as PDF in the print window to download your certificate.");
  }

  async function shareCertificate() {
    const title = "Learnyfi Certificate of Excellence";
    const text =
      `${name || "A Learnyfi student"} earned a Certificate of Excellence ` +
      `in ${subject} (${exam}) with ${percentage}% (${score}/${totalQuestions}). ` +
      `Certificate reference: ${certificateId}.`;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setMessage(
          "Certificate details copied. You can paste them into WhatsApp or another app.",
        );
      } else {
        setMessage(
          "Use Download certificate to save a PDF, then share it from your device.",
        );
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      setMessage("Sharing was unavailable. Download the certificate as a PDF instead.");
    }
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-500/30 dark:bg-amber-500/10">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            <Award className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">
              Congratulations! You earned a Certificate of Excellence.
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-800 dark:text-amber-100">
              You achieved the required score of 80% or higher in your timed
              practice. Your certificate is ready to share.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="certificate-student-name"
          className="mb-2 block text-sm font-semibold"
        >
          Student name for certificate
        </label>
        <input
          id="certificate-student-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your full name"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:bg-slate-900"
        />
      </div>

      <div
        ref={certificateRef}
        className="certificate rounded-xl border-4 border-double border-amber-500 bg-[#fffdf5] p-5 text-center text-blue-950 sm:p-9"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-500 text-amber-600">
          <Award className="h-8 w-8" />
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-amber-700">
          Learnyfi
        </p>

        <h2 className="mt-3 text-2xl font-bold sm:text-4xl">
          Certificate of Excellence
        </h2>

        <p className="mt-4 text-sm text-slate-600">
          This certificate is proudly awarded to
        </p>

        <p className="student-name my-4 break-words text-2xl font-bold text-blue-950 sm:text-3xl">
          {name.trim() || "Student Name"}
        </p>

        <p className="mx-auto max-w-xl text-sm leading-7 text-slate-700 sm:text-base">
          in recognition of excellent performance in timed practice and
          demonstrated knowledge of
        </p>

        <h3 className="mt-3 text-xl font-bold sm:text-2xl">{subject}</h3>

        <p className="mt-1 text-sm text-slate-600">{exam} Examination Practice</p>

        <p className="score mt-5 text-lg font-bold text-amber-700 sm:text-2xl">
          {percentage}% — {score} out of {totalQuestions}
        </p>

        <div className="certificate-footer mt-8 flex flex-col justify-between gap-3 border-t border-amber-300 pt-4 text-left sm:flex-row">
          <div>
            <p className="text-xs text-slate-500">Date awarded</p>
            <p className="text-sm font-semibold">{issuedDate}</p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs text-slate-500">Certificate reference</p>
            <p className="break-all text-sm font-semibold">
              {certificateId || "Generating reference..."}
            </p>
          </div>
        </div>

        <p className="mt-5 text-xs text-slate-500">
          Issued by Learnyfi · Learn, practise, excel.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={downloadCertificate}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Download / Save as PDF
        </button>

        <button
          type="button"
          onClick={() => void shareCertificate()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5"
        >
          <Share2 className="h-4 w-4" />
          Share achievement
        </button>
      </div>

      {message && (
        <p role="status" className="text-sm text-slate-500 dark:text-slate-400">
          {message}
        </p>
      )}
    </section>
  );
}

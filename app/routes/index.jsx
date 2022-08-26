import PawnRow from "~/components/pawn-display/pawn-display";
import SaveFileDropzone from "~/components/save-file-dropzone";

export default function Index() {
  return (
    <div>
      <SaveFileDropzone />
      <PawnRow />
    </div>
  );
}

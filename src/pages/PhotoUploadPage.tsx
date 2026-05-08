import { Show } from "solid-js"

interface PhotoUploadPageProperties {
  imageUrl: string | null
  onPhotoUpload: (event: Event) => void
  onNext: () => void
}

export default function PhotoUploadPage(properties: PhotoUploadPageProperties) {
  return (
    <div class="page">
      <h2>{properties.imageUrl ? "Your Photo" : "Upload a Photo"}</h2>

      <Show when={properties.imageUrl}>
        <img class="preview-image" src={properties.imageUrl!} alt="uploaded" />
      </Show>

      <label class="upload-label">
        {properties.imageUrl ? "Choose a Different Image" : "Choose Image"}
        <input type="file" accept="image/*" onChange={properties.onPhotoUpload} />
      </label>

      <Show when={properties.imageUrl}>
        <button class="next-button" onClick={properties.onNext}>
          Next
        </button>
      </Show>
    </div>
  )
}

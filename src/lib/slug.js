import { default as GithubSlugger } from 'github-slugger';

const slugger = new GithubSlugger();

export function generateSlug(title) {
  if (!title) return '';
  // Create a unique slug by resetting and using the title
  slugger.reset();
  return slugger.slug(title);
}

export function ensureUniqueSlug(slug, existingSlugs = []) {
  let finalSlug = slug;
  let counter = 1;
  
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return finalSlug;
}

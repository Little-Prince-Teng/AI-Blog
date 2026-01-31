export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  locale: string;
  readingTime: number;
}

export async function getArticles(locale: string): Promise<Article[]> {
  const articles: Article[] = [];
  
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const articlesDir = path.join(process.cwd(), 'content', 'articles', locale);
    const files = await fs.readdir(articlesDir);
    
    for (const file of files) {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(articlesDir, file);
        const content = await fs.readFile(filePath, 'utf-8');
        
        const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          const article: Partial<Article> = {
            slug: file.replace('.mdx', ''),
            locale,
          };
          
          frontmatter.split('\n').forEach(line => {
            const [key, ...values] = line.split(': ');
            if (key && values.length > 0) {
              let value = values.join(': ').trim();
              value = value.replace(/^"|"$/g, '');
              if (key === 'title') article.title = value;
              if (key === 'description') article.description = value;
              if (key === 'date') article.date = value;
              if (key === 'category') article.category = value;
              if (key === 'tags') {
                article.tags = value.replace(/\[|\]/g, '').split(',').map(tag => tag.trim().replace(/^"|"$/g, ''));
              }
              if (key === 'readingTime') article.readingTime = parseInt(value);
            }
          });
          
          if (article.title && article.description && article.date) {
            articles.push(article as Article);
          }
        }
      }
    }
    
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading articles:', error);
  }
  
  return articles;
}

export async function getArticle(slug: string, locale: string): Promise<Article | null> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const articlesDir = path.join(process.cwd(), 'content', 'articles', locale);
    const filePath = path.join(articlesDir, `${slug}.mdx`);
    
    const content = await fs.readFile(filePath, 'utf-8');
    
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const article: Partial<Article> = {
        slug,
        locale,
      };
      
      frontmatter.split('\n').forEach(line => {
        const [key, ...values] = line.split(': ');
        if (key && values.length > 0) {
          let value = values.join(': ').trim();
          value = value.replace(/^"|"$/g, '');
          if (key === 'title') article.title = value;
          if (key === 'description') article.description = value;
          if (key === 'date') article.date = value;
          if (key === 'category') article.category = value;
          if (key === 'tags') {
            article.tags = value.replace(/\[|\]/g, '').split(',').map(tag => tag.trim().replace(/^"|"$/g, ''));
          }
          if (key === 'readingTime') article.readingTime = parseInt(value);
        }
      });
      
      if (article.title && article.description && article.date) {
        return article as Article;
      }
    }
  } catch (error) {
    console.error('Error reading article:', error);
  }
  
  return null;
}
